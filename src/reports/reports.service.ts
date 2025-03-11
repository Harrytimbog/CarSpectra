import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  // inject the report repository in the service (dependency injection)
  constructor(@InjectRepository(Report) private repo: Repository<Report>) { }



  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    // find the report by id
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });
    // if the report is not found, throw an exception
    if (!report) {
      throw new NotFoundException('report not found');
    }
    // update the report's approved field
    report.approved = approved;
    // save the updated report
    return this.repo.save(report);
  }

  createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    return this.repo.createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng between -5 and 5', { lng })
      .andWhere('lat - :lat between -5 and 5', { lat })
      .andWhere('year - :year between -3 and 3', { year })
      .orderBy('mileage - :mileage', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
}

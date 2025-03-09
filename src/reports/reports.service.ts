import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';

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
}

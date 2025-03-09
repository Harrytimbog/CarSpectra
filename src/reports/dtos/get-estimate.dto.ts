import { IsNumber, IsString, Min, Max, IsLongitude, IsLatitude } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @Transform(({ value }) => parseInt(value)) // transform string to number because query params are always strings
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @Transform(({ value }) => parseInt(value)) // transform string to number because query params are always strings
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @Transform(({ value }) => parseFloat(value)) // transform string to number because query params are always strings
  @IsLongitude()
  lng: number;

  @Transform(({ value }) => parseFloat(value)) // transform string to number because query params are always strings
  @IsLatitude()
  lat: number;
}

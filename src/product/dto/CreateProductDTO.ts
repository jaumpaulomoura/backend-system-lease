/* eslint-disable prettier/prettier */
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  marca: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  daily_value?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  weekly_value?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  monthly_value?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  annual_value?: number;
}

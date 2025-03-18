/* eslint-disable prettier/prettier */
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateStockDTO {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  id_produto: number;

  @IsNotEmpty()
  @IsString()
  numero_patrimonio: string;

  @IsOptional()
  @IsString()
  nota_fiscal?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  valor_pago: number;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}

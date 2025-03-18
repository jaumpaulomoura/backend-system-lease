/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreateLeaseItemDto {
  @IsNotEmpty()
  @IsInt()
  id_locacao: number;

  @IsNotEmpty()
  @IsInt()
  id_patrimonio: number;

  @IsNotEmpty()
  @IsNumber()
  valor_unit_diario: number;

  @IsNotEmpty()
  @IsNumber()
  valor_unit_semanal: number;

  @IsNotEmpty()
  @IsNumber()
  valor_unit_mensal: number;

  @IsNotEmpty()
  @IsNumber()
  valor_unit_anual: number;

  @IsNotEmpty()
  @IsNumber()
  valor_negociado_diario: number;

  @IsNotEmpty()
  @IsNumber()
  valor_negociado_semanal: number;

  @IsNotEmpty()
  @IsNumber()
  valor_negociado_mensal: number;

  @IsNotEmpty()
  @IsNumber()
  valor_negociado_anual: number;
}

export class UpdateLeaseItemDto {
  @IsOptional()
  @IsNumber()
  valor_unit_diario?: number;

  @IsOptional()
  @IsNumber()
  valor_unit_semanal?: number;

  @IsOptional()
  @IsNumber()
  valor_unit_mensal?: number;

  @IsOptional()
  @IsNumber()
  valor_unit_anual?: number;

  @IsOptional()
  @IsNumber()
  valor_negociado_diario?: number;

  @IsOptional()
  @IsNumber()
  valor_negociado_semanal?: number;

  @IsOptional()
  @IsNumber()
  valor_negociado_mensal?: number;

  @IsOptional()
  @IsNumber()
  valor_negociado_anual?: number;
}

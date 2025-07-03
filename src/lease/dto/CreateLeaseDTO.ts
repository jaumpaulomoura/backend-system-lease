/* eslint-disable prettier/prettier */
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDate,
  IsNumber,
  ArrayNotEmpty,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLeaseItemDto } from './createLeaseItensDTO';

export class CreateLeaseDTO {
  @IsNotEmpty()
  @IsInt()
  cliente_id?: number;

  @IsNotEmpty()
  @IsString()
  rua_locacao: string;

  @IsNotEmpty()
  @IsString()
  numero_locacao: string;

  @IsOptional()
  @IsString()
  complemento_locacao?: string;

  @IsNotEmpty()
  @IsString()
  bairro_locacao: string;

  @IsNotEmpty()
  @IsString()
  cidade_locacao: string;

  @IsNotEmpty()
  @IsString()
  estado_locacao: string;

  @IsNotEmpty()
  @IsString()
  cep_locacao: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  data_inicio: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  data_prevista_devolucao: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  data_real_devolucao?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  data_pagamento?: Date;

  @IsNotEmpty()
  @IsNumber()
  valor_total: number;
  @IsNotEmpty()
  @IsNumber()
  valor_multa: number;

  @IsOptional()
  @IsNumber()
  valor_frete?: number;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsArray()
  @ArrayNotEmpty()
  leaseItems: CreateLeaseItemDto[];
}

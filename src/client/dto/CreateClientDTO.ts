/* eslint-disable prettier/prettier */
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateClientDTO {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  cpf_cnpj: string;

  @IsNotEmpty()
  @IsPhoneNumber('BR')
  telefone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  rua: string;

  @IsNotEmpty()
  @IsString()
  numero: string;

  @IsOptional()
  @IsString()
  complemento?: string;

  @IsNotEmpty()
  @IsString()
  bairro: string;

  @IsNotEmpty()
  @IsString()
  cidade: string;

  @IsNotEmpty()
  @IsString()
  estado: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/\d{5}-\d{3}/)
  cep: string;

  @IsNotEmpty()
  @IsString()
  rua_cobranca: string;

  @IsNotEmpty()
  @IsString()
  numero_cobranca: string;

  @IsOptional()
  @IsString()
  complemento_cobranca?: string;

  @IsNotEmpty()
  @IsString()
  bairro_cobranca: string;

  @IsNotEmpty()
  @IsString()
  cidade_cobranca: string;

  @IsNotEmpty()
  @IsString()
  estado_cobranca: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/\d{5}-\d{3}/)
  cep_cobranca: string;
}

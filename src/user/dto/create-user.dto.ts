/* eslint-disable prettier/prettier */
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsString()
  user: string;

  @IsString()
  document: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
  })
  password: string;

  @IsOptional()
  @IsBoolean()
  active: boolean;

  @IsOptional()
  @IsEnum(Role)
  role: number;
}

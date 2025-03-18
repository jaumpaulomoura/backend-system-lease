/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDTO } from './CreateProductDTO';

export class UpdatePatchProductDTO extends PartialType(CreateProductDTO) {}

/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateStockDTO } from './CreateStockDTO';

export class UpdatePatchStockDTO extends PartialType(CreateStockDTO) {}

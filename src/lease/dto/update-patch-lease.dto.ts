/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaseDTO } from './CreateLeaseDTO';

export class UpdatePatchLeaseDTO extends PartialType(CreateLeaseDTO) {}

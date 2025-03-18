/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDTO } from './CreateClientDTO';

export class UpdatePatchClientDTO extends PartialType(CreateClientDTO) {}

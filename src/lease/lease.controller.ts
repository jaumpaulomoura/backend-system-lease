/* eslint-disable prettier/prettier */
import { AuthGuard } from 'src/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { ParamId } from 'src/decorators/param-id.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { LeaseService } from './lease.service';
import { CreateLeaseDTO } from './dto/CreateLeaseDTO';
import { UpdatePutLeaseDTO } from './dto/update-put-lease.dto';
import { UpdatePatchLeaseDTO } from './dto/update-patch-lease.dto';
import { Lease } from '@prisma/client';

// @Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller('leases')
export class LeaseController {
  constructor(private readonly leaseService: LeaseService) {}

  @Post()
  async create(@Body() data: CreateLeaseDTO) {
    console.log('📦 Dados recebidos no controller:', data);
    return this.leaseService.create(data);
  }

  @Get()
  async read() {
    return this.leaseService.list();
  }

  @Get(':id')
  async readOne(@ParamId() id) {
    return this.leaseService.show(id);
  }
  @Get('filtered-leases/:searchString')
  async getFilteredLease(
    @Param('searchString') searchString: string,
  ): Promise<Lease[]> {
    return this.leaseService.getFilteredLeases(searchString);
  }

  @Put(':id')
  async update(@Body() data: UpdatePutLeaseDTO, @ParamId() id) {
    return this.leaseService.update(id, data);
  }

  @Patch(':id')
  async updatePartial(@Body() data: UpdatePatchLeaseDTO, @ParamId() id) {
    return this.leaseService.updatePartial(id, data);
  }

  @Delete(':id')
  async delete(@ParamId() id) {
    return this.leaseService.delete(id);
  }
}

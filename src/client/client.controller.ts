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
import { ClientService } from './client.service';
import { CreateClientDTO } from './dto/CreateClientDTO';
import { UpdatePutClientDTO } from './dto/update-put-client.dto';
import { UpdatePatchClientDTO } from './dto/update-patch-client.dto';
import { Client } from '@prisma/client';

// @Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async create(@Body() data: CreateClientDTO) {
    return this.clientService.create(data);
  }

  @Get()
  async read() {
    return this.clientService.list();
  }

  @Get(':id')
  async readOne(@ParamId() id) {
    return this.clientService.show(id);
  }
  @Get('filtered-clients/:searchString')
  async getFilteredClient(
    @Param('searchString') searchString: string,
  ): Promise<Client[]> {
    return this.clientService.getFilteredClients(searchString);
  }

  @Put(':id')
  async update(@Body() data: UpdatePutClientDTO, @ParamId() id) {
    return this.clientService.update(id, data);
  }

  @Patch(':id')
  async updatePartial(@Body() data: UpdatePatchClientDTO, @ParamId() id) {
    return this.clientService.updatePartial(id, data);
  }

  @Delete(':id')
  async delete(@ParamId() id) {
    return this.clientService.delete(id);
  }
}

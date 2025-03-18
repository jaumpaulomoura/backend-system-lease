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
import { StockService } from './stock.service';
import { CreateStockDTO } from './dto/CreateStockDTO';
import { UpdatePutStockDTO } from './dto/update-put-stock.dto';
import { UpdatePatchStockDTO } from './dto/update-patch-stock.dto';
import { Stock } from '@prisma/client';

// @Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  async create(@Body() data: CreateStockDTO) {
    return this.stockService.create(data);
  }

  @Get()
  async read() {
    return this.stockService.list();
  }

  @Get(':id')
  async readOne(@ParamId() id) {
    return this.stockService.show(id);
  }
  @Get('filtered-stocks/:searchString')
  async getFilteredStock(
    @Param('searchString') searchString: string,
  ): Promise<Stock[]> {
    return this.stockService.getFilteredStocks(searchString);
  }

  @Put(':id')
  async update(@Body() data: UpdatePutStockDTO, @ParamId() id) {
    return this.stockService.update(id, data);
  }

  @Patch(':id')
  async updatePartial(@Body() data: UpdatePatchStockDTO, @ParamId() id) {
    return this.stockService.updatePartial(id, data);
  }

  @Delete(':id')
  async delete(@ParamId() id) {
    return this.stockService.delete(id);
  }
}

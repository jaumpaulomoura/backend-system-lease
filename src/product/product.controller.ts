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
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/CreateProductDTO';
import { UpdatePutProductDTO } from './dto/update-put-product.dto';
import { UpdatePatchProductDTO } from './dto/update-patch-product.dto';
import { Product } from '@prisma/client';

// @Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() data: CreateProductDTO) {
    return this.productService.create(data);
  }

  @Get()
  async read() {
    return this.productService.list();
  }

  @Get(':id')
  async readOne(@ParamId() id) {
    return this.productService.show(id);
  }
  @Get('filtered-products/:searchString')
  async getFilteredProduct(
    @Param('searchString') searchString: string,
  ): Promise<Product[]> {
    return this.productService.getFilteredProducts(searchString);
  }

  @Put(':id')
  async update(@Body() data: UpdatePutProductDTO, @ParamId() id) {
    return this.productService.update(id, data);
  }

  @Patch(':id')
  async updatePartial(@Body() data: UpdatePatchProductDTO, @ParamId() id) {
    return this.productService.updatePartial(id, data);
  }

  @Delete(':id')
  async delete(@ParamId() id) {
    return this.productService.delete(id);
  }
}

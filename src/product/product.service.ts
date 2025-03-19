/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDTO } from './dto/CreateProductDTO';
import { UpdatePutProductDTO } from './dto/update-put-product.dto';
import { UpdatePatchProductDTO } from './dto/update-patch-product.dto';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // Criação de um novo produto
  async create(data: CreateProductDTO) {
    const { ...productData } = data;

    try {
      const createdProduct = await this.prisma.product.create({
        data: {
          ...productData,
        },
      });
      return createdProduct;
    } catch (error) {
      // Lidar com erros aqui
      throw error;
    }
  }

  // Listar todos os produtos
  async list() {
    const productDetails = await this.prisma.product.findMany();
    return productDetails;
  }

  // Detalhar um produto específico
  async show(id: number) {
    await this.exists(id);

    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  // Buscar produtos filtrados por name
  async getFilteredProducts(searchString: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        OR: [
          {
            marca: {
              contains: searchString,
            },
          },
        ],
      },
    });
  }

  // Atualizar um produto (completamente)
  async update(
    id: number,
    {
      active,
      name,
      marca,
      description,
      daily_value,
      weekly_value,
      monthly_value,
      annual_value,
    }: UpdatePutProductDTO,
  ) {
    await this.exists(id);

    return this.prisma.product.update({
      data: {
        active,
        name,
        marca,
        description,
        daily_value,
        weekly_value,
        monthly_value,
        annual_value,
      },
      where: { id },
    });
  }

  // Atualizar um produto (parcialmente)
  async updatePartial(
    id: number,
    {
      active,
      name,
      marca,
      description,
      daily_value,
      weekly_value,
      monthly_value,
      annual_value,
    }: UpdatePatchProductDTO,
  ) {
    await this.exists(id);

    const data: any = {};

    if (name) data.name = name;
    if (marca) data.marca = marca;
    if (active !== undefined) data.active = active;
    if (description) data.description = description;
    if (daily_value) data.daily_value = daily_value;
    if (weekly_value) data.weekly_value = weekly_value;
    if (monthly_value) data.monthly_value = monthly_value;
    if (annual_value) data.annual_value = annual_value;

    return this.prisma.product.update({
      data,
      where: { id },
    });
  }

  // Deletar um produto
  async delete(id: number) {
    await this.exists(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }

  // Verificar se o produto existe
  private async exists(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Produto com o id ${id} não encontrado.`);
    }
  }
}

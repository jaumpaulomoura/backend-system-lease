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

  async list() {
    const products = await this.prisma.product.findMany({
      include: {
        stock: {
          select: {
            id: true,
            numero_patrimonio: true,
            status: true,
            valor_pago: true,
            createdAt: true,
          },
        },
      },
    });

    return products.map((product) => ({
      ...product,
      daily_value: product.daily_value?.toString() || null,
      weekly_value: product.weekly_value?.toString() || null,
      monthly_value: product.monthly_value?.toString() || null,
      annual_value: product.annual_value?.toString() || null,
      stock: product.stock.map((item) => ({
        ...item,
        valor_pago: item.valor_pago.toString(),
      })),
    }));
  }

  // Detalhar um produto específico
  async show(id: number) {
    await this.exists(id);

    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async getFilteredProducts(searchString: string): Promise<Product[]> {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          OR: [
            {
              id: {
                // Se id for um número, você pode tentar buscar por igualdade
                equals: parseInt(searchString), // Busca pelo id exato
              },
            },
            {
              name: {
                contains: searchString,
              },
            },
            {
              marca: {
                contains: searchString,
              },
            },
          ],
        },
      });
      return products;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw new Error('Erro ao buscar produtos');
    }
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

  async delete(id: number) {
    await this.exists(id); // Certifica-se de que o produto existe antes de deletar

    // Exclui os registros de Stock que fazem referência ao Product
    await this.prisma.stock.deleteMany({
      where: { id_produto: id },
    });

    // Agora é seguro deletar o produto
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

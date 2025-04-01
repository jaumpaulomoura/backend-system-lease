/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStockDTO } from './dto/CreateStockDTO';
import { UpdatePutStockDTO } from './dto/update-put-stock.dto';
import { UpdatePatchStockDTO } from './dto/update-patch-stock.dto';
import { Stock } from '@prisma/client';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateStockDTO) {
    return this.prisma.stock.create({
      data,
    });
  }

  async list() {
    return this.prisma.stock.findMany({
      include: {
        produto: true,
      },
    });
  }
  async show(id: number) {
    await this.exists(id);

    return this.prisma.stock.findUnique({
      where: {
        id,
      },
    });
  }

  // async search(query: string) {
  //   return this.prisma
  //     .$queryRaw`SELECT * FROM stocks WHERE name LIKE '%${query}%';`
  // }

  // async search(query: string) {
  //   return this.prisma.stocks.findMany({
  //     where: {
  //       name: {
  //         contains: query
  //       }
  //     }
  //   })
  // }
  async getFilteredStocks(searchString: string): Promise<Stock[]> {
    // Tenta converter a string de pesquisa para número
    const searchNumber = parseInt(searchString, 10);

    // Se for um número válido, busca por id_produto
    return this.prisma.stock.findMany({
      where: {
        id_produto: searchNumber || undefined, // Se searchNumber for válido, usará como filtro
      },
    });
  }

  async update(
    id: number,
    {
      id_produto,
      numero_patrimonio,
      nota_fiscal,
      valor_pago,
      status,
      observacoes,
    }: UpdatePutStockDTO,
  ) {
    await this.exists(id);

    return this.prisma.stock.update({
      data: {
        id_produto,
        numero_patrimonio,
        nota_fiscal,
        valor_pago,
        status,
        observacoes,
      },
      where: {
        id,
      },
    });
  }

  async updatePartial(
    id: number,
    {
      id_produto,
      numero_patrimonio,
      nota_fiscal,
      valor_pago,
      status,
      observacoes,
    }: UpdatePatchStockDTO,
  ) {
    await this.exists(id);

    const data: any = {};

    if (id_produto) data.id_produto = id_produto;
    if (numero_patrimonio) data.numero_patrimonio = numero_patrimonio;
    if (nota_fiscal) data.nota_fiscal = nota_fiscal;
    if (valor_pago) data.valor_pago = valor_pago;
    if (status) data.status = status;
    if (observacoes) data.observacoes = observacoes;
    return this.prisma.stock.update({
      data,
      where: {
        id,
      },
    });
  }

  async delete(id: number) {
    await this.exists(id);

    return this.prisma.stock.delete({
      where: {
        id,
      },
    });
  }

  async exists(id: number) {
    if (
      !(await this.prisma.stock.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException(`Cliente/Fornecedor ${id} não existe.`);
    }
  }
}

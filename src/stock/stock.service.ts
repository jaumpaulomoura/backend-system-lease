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

  // Criação de um novo item de estoque
  async create(data: CreateStockDTO) {
    const { ...stockData } = data;

    try {
      const createdStock = await this.prisma.stock.create({
        data: {
          ...stockData,
        },
      });
      return createdStock;
    } catch (error) {
      throw error;
    }
  }

  // Listar todos os itens de estoque
  async list() {
    const stockDetails = await this.prisma.stock.findMany();
    return stockDetails;
  }

  // Detalhar um item de estoque específico
  async show(id_patrimonio: number) {
    await this.exists(id_patrimonio);

    return this.prisma.stock.findUnique({
      where: { id_patrimonio }, // Usando id_patrimonio como chave primária
    });
  }

  // Buscar itens de estoque filtrados por número de patrimônio
  async getFilteredStocks(searchString: string): Promise<Stock[]> {
    return this.prisma.stock.findMany({
      where: {
        OR: [
          {
            numero_patrimonio: {
              contains: searchString,
            },
          },
        ],
      },
    });
  }

  // Atualizar um item de estoque (completamente)
  async update(
    id_patrimonio: number,
    {
      id_produto,
      numero_patrimonio,
      nota_fiscal,
      valor_pago,
      status,
      observacoes,
    }: UpdatePutStockDTO,
  ) {
    await this.exists(id_patrimonio);

    return this.prisma.stock.update({
      data: {
        id_produto,
        numero_patrimonio,
        nota_fiscal,
        valor_pago,
        status,
        observacoes,
      },
      where: { id_patrimonio }, // Usando id_patrimonio como chave primária
    });
  }

  // Atualizar parcialmente um item de estoque
  async updatePartial(
    id_patrimonio: number,
    {
      id_produto,
      numero_patrimonio,
      nota_fiscal,
      valor_pago,
      status,
      observacoes,
    }: UpdatePatchStockDTO,
  ) {
    await this.exists(id_patrimonio);

    const data: any = {};

    if (id_produto) data.id_produto = id_produto;
    if (numero_patrimonio) data.numero_patrimonio = numero_patrimonio;
    if (nota_fiscal) data.nota_fiscal = nota_fiscal;
    if (valor_pago) data.valor_pago = valor_pago;
    if (status) data.status = status;
    if (observacoes) data.observacoes = observacoes;

    return this.prisma.stock.update({
      data,
      where: { id_patrimonio }, // Usando id_patrimonio como chave primária
    });
  }

  // Deletar um item de estoque
  async delete(id_patrimonio: number) {
    await this.exists(id_patrimonio);

    return this.prisma.stock.delete({
      where: { id_patrimonio }, // Usando id_patrimonio como chave primária
    });
  }

  // Verificar se o item de estoque existe
  private async exists(id_patrimonio: number) {
    const stock = await this.prisma.stock.findUnique({
      where: { id_patrimonio }, // Usando id_patrimonio para verificar a existência
    });

    if (!stock) {
      throw new NotFoundException(
        `Item de estoque com o id_patrimonio ${id_patrimonio} não encontrado.`,
      );
    }
  }
}

/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLeaseDTO } from './dto/CreateLeaseDTO';
import { Lease } from '@prisma/client';
import { UpdatePatchLeaseDTO } from './dto/update-patch-lease.dto';

@Injectable()
export class LeaseService {
  constructor(private prisma: PrismaService) {}

  async exists(id: number): Promise<void> {
    const lease = await this.prisma.lease.findUnique({
      where: { id_locacao: id },
    });

    if (!lease) {
      throw new NotFoundException(`Locação com ID ${id} não encontrada.`);
    }
  }

  async create(createLeaseDTO: CreateLeaseDTO): Promise<Lease> {
    // Verificar se o cliente existe
    const cliente = await this.prisma.client.findUnique({
      where: { id: createLeaseDTO.id_cliente },
    });

    if (!cliente) {
      throw new NotFoundException(
        `Cliente com ID ${createLeaseDTO.id_cliente} não encontrado.`,
      );
    }

    // Criação dos itens da locação
    const leaseItemsData = createLeaseDTO.leaseItems.map((item) => ({
      id_patrimonio: item.id_patrimonio,
      valor_unit_diario: item.valor_unit_diario,
      valor_unit_semanal: item.valor_unit_semanal,
      valor_unit_mensal: item.valor_unit_mensal,
      valor_unit_anual: item.valor_unit_anual,
      valor_negociado_diario: item.valor_negociado_diario,
      valor_negociado_semanal: item.valor_negociado_semanal,
      valor_negociado_mensal: item.valor_negociado_mensal,
      valor_negociado_anual: item.valor_negociado_anual,
    }));

    // Criação da locação com os itens
    const lease = await this.prisma.lease.create({
      data: {
        id_cliente: createLeaseDTO.id_cliente,
        rua_locacao: createLeaseDTO.rua_locacao,
        numero_locacao: createLeaseDTO.numero_locacao,
        complemento_locacao: createLeaseDTO.complemento_locacao,
        bairro_locacao: createLeaseDTO.bairro_locacao,
        cidade_locacao: createLeaseDTO.cidade_locacao,
        estado_locacao: createLeaseDTO.estado_locacao,
        cep_locacao: createLeaseDTO.cep_locacao,
        data_inicio: createLeaseDTO.data_inicio,
        data_prevista_devolucao: createLeaseDTO.data_prevista_devolucao,
        data_real_devolucao: createLeaseDTO.data_real_devolucao,
        valor_total: createLeaseDTO.valor_total,
        status: createLeaseDTO.status,
        observacoes: createLeaseDTO.observacoes,
        leaseItems: {
          create: leaseItemsData, // Relacionamento com os itens
        },
      },
      include: {
        leaseItems: true, // Incluir os itens da locação
      },
    });

    return lease;
  }

  async list() {
    const leases = await this.prisma.lease.findMany({
      include: {
        leaseItems: true,
        cliente: true, // Incluindo cliente para os dados completos
      },
    });
    return leases;
  }

  async show(id: number) {
    const lease = await this.prisma.lease.findUnique({
      where: { id_locacao: id },
      include: {
        leaseItems: true,
        cliente: true,
      },
    });

    if (!lease) {
      throw new NotFoundException(`Locação com ID ${id} não encontrada.`);
    }

    return lease;
  }

  async update(id: number, data: any) {
    await this.exists(id);
    return this.prisma.lease.update({
      data,
      where: {
        id_locacao: id,
      },
    });
  }

  async delete(id: number) {
    const lease = await this.prisma.lease.findUnique({
      where: { id_locacao: id },
      include: { leaseItems: true },
    });

    if (!lease) {
      throw new NotFoundException(`Locação com ID ${id} não encontrada.`);
    }

    // Excluir os itens da locação
    await Promise.all(
      lease.leaseItems.map(async (item) => {
        await this.prisma.leaseItem.delete({
          where: { id_item_locacao: item.id_item_locacao },
        });
      }),
    );

    // Excluir a locação
    await this.prisma.lease.delete({
      where: { id_locacao: id },
    });

    return lease;
  }
  async getFilteredLeases(searchString: string) {
    return this.prisma.lease.findMany({
      where: {
        OR: [
          {
            status: {
              contains: searchString,
            },
          },
          {
            cliente: {
              name: {
                contains: searchString,
              },
            },
          },
        ],
      },
      include: {
        leaseItems: true,
      },
    });
  }
  async updatePartial(
    id: number,
    { status, observacoes }: UpdatePatchLeaseDTO,
  ) {
    await this.exists(id);

    // Dados a serem atualizados (somente os campos não nulos)
    const data: any = {};

    if (status) {
      data.status = status;
    }

    if (observacoes) {
      data.observacoes = observacoes;
    }

    return this.prisma.lease.update({
      where: {
        id_locacao: id,
      },
      data: data,
    });
  }
}

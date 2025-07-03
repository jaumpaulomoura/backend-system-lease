/* eslint-disable prettier/prettier */
// import { Stock } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLeaseDTO } from './dto/CreateLeaseDTO';
import { Lease, Prisma } from '@prisma/client';
// import { UpdateLeaseItemDto } from './dto/createLeaseItensDTO';
import { UpdatePatchLeaseDTO } from './dto/update-patch-lease.dto';
// import { UpdatePatchLeaseDTO } from './dto/update-patch-lease.dto';

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
      where: { id: createLeaseDTO.cliente_id },
    });

    if (!cliente) {
      throw new NotFoundException(
        `Cliente com ID ${createLeaseDTO.cliente_id} não encontrado.`,
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
    console.log('Data de pagamento recebida:', createLeaseDTO.data_pagamento);
    console.log('Tipo:', typeof createLeaseDTO.data_pagamento);
    // Criação da locação com os itens
    const lease = await this.prisma.lease.create({
      data: {
        cliente_id: createLeaseDTO.cliente_id,
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
        data_pagamento: createLeaseDTO.data_pagamento,
        valor_total: createLeaseDTO.valor_total,
        valor_multa: createLeaseDTO.valor_multa,
        valor_frete: createLeaseDTO.valor_frete,
        status: createLeaseDTO.status,
        observacoes: createLeaseDTO.observacoes,
        leaseItems: {
          create: leaseItemsData,
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
        leaseItems: {
          include: {
            patrimonio: {
              include: {
                produto: true, // Inclui informações do produto relacionado ao estoque
              },
            },
          },
        },
        cliente: true,
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
    console.log('\n=== INÍCIO DA ATUALIZAÇÃO ===');
    console.log('Data recebida para devolução real:', data.data_real_devolucao);

    // Verifica se a data foi realmente fornecida para atualização
    if (typeof data.data_real_devolucao !== 'undefined') {
      console.log('Atualização explícita de data_real_devolucao solicitada');

      // Converte para Date e valida
      const novaData = new Date(data.data_real_devolucao);
      if (isNaN(novaData.getTime())) {
        throw new Error('Data de devolução real inválida');
      }

      // Mantém o valor exato fornecido
      data.data_real_devolucao = novaData;
    }

    const result = await this.prisma.lease.update({
      where: { id_locacao: id },
      data: {
        ...data,
        // Garante que updatedAt será atualizado
        updatedAt: new Date(),
      },
    });

    console.log('Resultado da atualização:', {
      data_real_devolucao: result.data_real_devolucao,
      updatedAt: result.updatedAt,
    });

    return result;
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
        cliente: true,
        leaseItems: true,
      },
    });
  }
  async updatePartial(id_locacao: number, data: UpdatePatchLeaseDTO) {
    await this.exists(id_locacao);

    const prismaData: Prisma.LeaseUpdateInput = {
      ...data,
      cliente: data.cliente_id
        ? { connect: { id: data.cliente_id } }
        : undefined,
      leaseItems: data.leaseItems
        ? {
            deleteMany: {}, // Remove os itens antigos
            create: data.leaseItems.map((item) => ({
              id_patrimonio: item.id_patrimonio,
              valor_unit_diario: item.valor_unit_diario,
              valor_unit_semanal: item.valor_unit_semanal,
              valor_unit_mensal: item.valor_unit_mensal,
              valor_unit_anual: item.valor_unit_anual,
              valor_negociado_diario: item.valor_negociado_diario,
              valor_negociado_semanal: item.valor_negociado_semanal,
              valor_negociado_mensal: item.valor_negociado_mensal,
              valor_negociado_anual: item.valor_negociado_anual,
            })),
          }
        : undefined,
    };

    return this.prisma.lease.update({
      data: prismaData,
      where: { id_locacao },
    });
  }

  // async updatePartial(id: number, updateData: UpdatePatchLeaseDTO) {
  //   console.log('[updatePartial] Iniciando atualização para ID:', id);
  //   console.log(
  //     '[updatePartial] Dados recebidos:',
  //     JSON.stringify(updateData, null, 2),
  //   );

  //   await this.exists(id);

  //   // Filtra campos undefined e mostra no log
  //   const data = Object.fromEntries(
  //     Object.entries(updateData).filter(([key, value]) => {
  //       if (value !== undefined) {
  //         console.log(`[updatePartial] Campo '${key}' será atualizado:`, value);
  //         return true;
  //       }
  //       console.log(`[updatePartial] Campo '${key}' ignorado (undefined)`);
  //       return false;
  //     }),
  //   );

  //   console.log(
  //     '[updatePartial] Dados que serão enviados para atualização:',
  //     data,
  //   );

  //   try {
  //     const result = await this.prisma.lease.update({
  //       where: {
  //         id_locacao: id,
  //       },
  //       data: data,
  //     });

  //     console.log(
  //       '[updatePartial] Atualização bem-sucedida. Resultado:',
  //       result,
  //     );
  //     return result;
  //   } catch (error) {
  //     console.error('[updatePartial] Erro na atualização:', error);
  //     throw error;
  //   }
  // }
}

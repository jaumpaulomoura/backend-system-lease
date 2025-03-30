/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDTO } from './dto/CreateClientDTO';
import { UpdatePutClientDTO } from './dto/update-put-client.dto';
import { UpdatePatchClientDTO } from './dto/update-patch-client.dto';
import { Client } from '@prisma/client';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateClientDTO) {
    try {
      console.log('Criando cliente com os dados:', data);
      const createdClient = await this.prisma.client.create({
        data: {
          name: data.name,
          cpf_cnpj: data.cpf_cnpj,
          telefone: data.telefone,
          email: data.email,
          rua: data.rua,
          numero: data.numero,
          complemento: data.complemento,
          bairro: data.bairro,
          cidade: data.cidade,
          estado: data.estado,
          cep: data.cep,
          rua_cobranca: data.rua_cobranca,
          numero_cobranca: data.numero_cobranca,
          complemento_cobranca: data.complemento_cobranca,
          bairro_cobranca: data.bairro_cobranca,
          cidade_cobranca: data.cidade_cobranca,
          estado_cobranca: data.estado_cobranca,
          cep_cobranca: data.cep_cobranca,
        },
      });

      console.log('Cliente criado com sucesso:', createdClient);
      return createdClient;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw new Error('Erro ao criar cliente');
    }
  }

  // Listar todos os clientes
  async list() {
    return this.prisma.client.findMany();
  }

  // Detalhar um cliente específico
  async show(id: number) {
    await this.exists(id);
    return this.prisma.client.findUnique({ where: { id } });
  }

  // Buscar clientes filtrados por nome ou CPF/CNPJ
  async getFilteredClients(searchString: string): Promise<Client[]> {
    return this.prisma.client.findMany({
      where: {
        OR: [
          { name: { contains: searchString } },
          { cpf_cnpj: { contains: searchString } },
        ],
      },
    });
  }

  // Atualizar um cliente (completo)
  async update(
    id: number,
    {
      name,
      cpf_cnpj,
      telefone,
      email,
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
      rua_cobranca,
      numero_cobranca,
      complemento_cobranca,
      bairro_cobranca,
      cidade_cobranca,
      estado_cobranca,
      cep_cobranca,
    }: UpdatePutClientDTO,
  ) {
    await this.exists(id);
    return this.prisma.client.update({
      data: {
        name,
        cpf_cnpj,
        telefone,
        email,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
        rua_cobranca,
        numero_cobranca,
        complemento_cobranca,
        bairro_cobranca,
        cidade_cobranca,
        estado_cobranca,
        cep_cobranca,
      },
      where: { id },
    });
  }

  // Atualizar um cliente (parcialmente)
  async updatePartial(id: number, data: UpdatePatchClientDTO) {
    await this.exists(id);
    return this.prisma.client.update({
      data,
      where: { id },
    });
  }

  // Deletar um cliente
  async delete(id: number) {
    await this.exists(id); // Certifica-se de que o produto existe antes de deletar

    // Agora é seguro deletar o produto
    return this.prisma.client.delete({
      where: { id },
    });
  }
  // Verificar se o cliente existe
  private async exists(id: number) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Cliente com o id ${id} não encontrado.`);
    }
  }
}

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

  // Criar um novo cliente
  async create(data: CreateClientDTO) {
    return this.prisma.client.create({
      data: { ...data },
    });
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
          { nome: { contains: searchString } },
          { cpf_cnpj: { contains: searchString } },
        ],
      },
    });
  }

  // Atualizar um cliente (completo)
  async update(
    id: number,
    {
      nome,
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
        nome,
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
    await this.exists(id);
    return this.prisma.client.delete({ where: { id } });
  }

  // Verificar se o cliente existe
  private async exists(id: number) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Cliente com o id ${id} não encontrado.`);
    }
  }
}

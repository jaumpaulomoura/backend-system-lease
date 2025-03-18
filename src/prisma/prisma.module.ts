import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

//teste
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}

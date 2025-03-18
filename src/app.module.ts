/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ProductModule } from './product/product.module';
import { StockModule } from './stock/stock.module';
import { ClientModule } from './client/client.module';
import { LeaseModule } from './lease/lease.module';
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 10, // Número máximo de requisições por IP
          ttl: 60 * 1000, // Tempo da janela em milissegundos (60 segundos)
        },
      ],
    }),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => ProductModule),
    forwardRef(() => StockModule),
    forwardRef(() => ClientModule),
    forwardRef(() => LeaseModule),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpCode,
  Get,
} from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { email, password }: AuthLoginDTO) {
    return this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Post('forget')
  @HttpCode(200) // Retorna status 200 mesmo se o email não existir (por segurança)
  async forget(@Body() { email }: AuthForgetDTO) {
    console.log('Requisição recebida no /forget com email:', email);
    const result = await this.authService.forget(email);
    console.log('Resultado do authService.forget:', result);
    return result;
  }

  @Post('reset')
  @HttpCode(200)
  async reset(@Body() { password, token }: AuthResetDTO) {
    return this.authService.reset(password, token);
  }

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User() user) {
    return { user };
  }

  @Get('test-email')
  async testEmail() {
    await this.authService.sendTestEmail();
    return { message: 'E-mail de teste enviado!' };
  }
}

/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'users';
  private resetIssuer = 'password_reset'; // Issuer específico para reset de senha

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  // =============================================
  // 🎯 MÉTODOS DE AUTENTICAÇÃO (JWT)
  // =============================================

  createToken(user: User) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '7 days',
          subject: String(user.id),
          issuer: this.issuer,
          audience: this.audience,
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        issuer: this.issuer,
        audience: this.audience,
      });
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    return this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    return this.createToken(user);
  }

  // =============================================
  // 🔐 MÉTODOS DE RECUPERAÇÃO DE SENHA
  // =============================================

  async forget(email: string) {
    // 1. Encontra o usuário (igual antes)
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return { message: 'Se o e-mail existir, um link será enviado.' };
    }

    // 2. Gera o token (igual antes)
    const resetToken = this.jwtService.sign(
      { id: user.id },
      { expiresIn: '1h', issuer: this.resetIssuer, audience: this.audience },
    );

    // 3. Atualiza o usuário (igual antes)
    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExp: new Date(Date.now() + 3600000) },
    });

    // 4. ENVIO REAL (EXATAMENTE IGUAL AO TESTE)
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Recuperação de Senha',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Solicitação de Redefinição de Senha</h2>
            <p>Olá,</p>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta. Se você fez essa solicitação, clique no link abaixo para criar uma nova senha:</p>
            <p>
              <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}" style="background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
                Redefinir Senha
              </a>
            </p>
            <p>Se você não solicitou a redefinição, ignore este e-mail.</p>
            <p>Atenciosamente</p>
          </div>
        `,
      });

      return { message: 'Link de redefinição enviado.' };
    } catch (error) {
      console.error('Erro ao enviar:', error);
      throw new Error('Falha no envio do e-mail');
    }
  }

  async reset(password: string, token: string) {
    try {
      // 1️⃣ Valida o token JWT
      const payload = this.jwtService.verify(token, {
        issuer: this.resetIssuer,
        audience: this.audience,
      });

      // 2️⃣ Verifica se o token está no banco e ainda é válido
      const user = await this.prisma.user.findFirst({
        where: {
          id: payload.id,
          resetToken: token,
          resetTokenExp: { gte: new Date() },
        },
      });

      if (!user) {
        throw new UnauthorizedException('Token inválido ou expirado.');
      }

      // 3️⃣ Valida a nova senha
      if (password.length < 6) {
        throw new BadRequestException(
          'A senha deve ter pelo menos 6 caracteres.',
        );
      }

      // 4️⃣ Atualiza a senha e limpa o token
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExp: null,
        },
      });

      // 5️⃣ Retorna um novo token de acesso (opcional)
      return {
        message: 'Senha redefinida com sucesso!',
        accessToken: this.createToken(user).accessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
  }
  async sendTestEmail() {
    try {
      await this.mailerService.sendMail({
        to: 'joaopaulo92803693@gmail.com', // 📩 Alterar para seu e-mail real
        subject: '🔥 Teste de Configuração',
        html: `
          <h1>Deu certo!</h1>
          <p>Se você recebeu isso, o e-mail está configurado corretamente.</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString()}</p>
        `,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new Error('Falha no envio - veja os logs do servidor');
    }
  }
}

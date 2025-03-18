/* eslint-disable prettier/prettier */
// import { AuthGuard } from 'src/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  // UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { ParamId } from 'src/decorators/param-id.decorator';
// import { Roles } from 'src/decorators/roles.decorator';
// import { Role } from 'src/enums/role.enum';
// import { RoleGuard } from 'src/guards/role.guard';

// @UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Roles(Role.Admin)
  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.userService.create(data);
  }

  @Get()
  async read() {
    return this.userService.list();
  }

  @Get(':id')
  async readOne(@ParamId() id) {
    return this.userService.show(id);
  }

  // @Roles(Role.Admin)
  @Put(':id')
  async update(@Body() data: UpdatePutUserDTO, @ParamId() id) {
    return this.userService.update(id, data);
  }

  // @Roles(Role.Admin)
  @Patch(':id')
  async updatePartial(@Body() data: UpdatePatchUserDTO, @ParamId() id) {
    return this.userService.updatePartial(id, data);
  }

  // @Roles(Role.Admin)
  @Delete(':id')
  async delete(@ParamId() id) {
    return this.userService.delete(id);
  }
}

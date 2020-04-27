import {
  Controller,
  Get,
  UseGuards,
  Body,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '../auth/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../entities/user.entity';
import { UpdateUserDTO } from '../models/user.model';
import { AuthService } from '../auth/auth.service';

@Controller('user')
export class UserController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard())
   findCurrentUser(@User() { username }: UserEntity) {
    return this.authService.findCurrentUser(username);
  }

  @Put()
  @UseGuards(AuthGuard())
  update(
    @User() { username }: UserEntity,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: {user: UpdateUserDTO},
  ) {
    return this.authService.updateUser(username, data.user);
  }
}

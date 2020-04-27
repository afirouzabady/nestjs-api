import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { RegistrationDTO, LoginDTO, UpdateUserDTO } from '../models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async register(credentials: RegistrationDTO) {
    try {
      const user = this.userRepo.create(credentials);
      await user.save();
      const payload = { username: user.username };
      const token = this.jwtService.sign(payload);
      return { user: { ...user.toJSON(), token } };
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Username or email has already been taken');
      }
      throw new InternalServerErrorException();
    }
  }

  async login({ email, password }: LoginDTO) {
    try {
      const user = await this.userRepo.findOne({ where: { email } });
      if (user && (await user.comparePassword(password))) {
        const payload = { username: user.username };
        const token = this.jwtService.sign(payload);

        return { user: { ...user.toJSON(), token } };
      }
      throw new UnauthorizedException('inavlid credentials');
    } catch (err) {
      throw new UnauthorizedException('inavlid credentials');
    }
  }

  async updateUser(username: string, data: UpdateUserDTO) {
    await this.userRepo.update({ username }, data);
    const user = await this.userRepo.findOne({ where: { username } });
    const payload = { username };
    const token = this.jwtService.sign(payload);
    return { user: { ...user.toJSON(), token } };
  }

  async findCurrentUser(username: string) {
    const user = await this.userRepo.findOne({ where: { username } });
    const payload = { username };
    const token = this.jwtService.sign(payload);
    return { user: { ...user.toJSON(), token } };
  }
}

import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { RegistrationDTO, LoginDTO } from '../models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        private jwtService: JwtService
    ) { }

    async register(credentials: RegistrationDTO) {
        try {
            const user = this.userRepo.create(credentials);
            await user.save();
            const payload = {username: user.username};
            const token = this.jwtService.sign(payload);
            return {user:{...user.toJSON(), token} };
        } catch (err) {
            if (err.code === '23505') {
                throw new ConflictException('Username has already been taken');
            }
            throw new InternalServerErrorException();
        }
    }

    async login({ email, password }: LoginDTO) {
        try {
            const user = await this.userRepo.findOne({ where: { email } });
            if (user && (await user.comparePassword(password))) {
                const payload = {username: user.username};
                const token = this.jwtService.sign(payload);

                return {user:{...user.toJSON(), token} };
            }
            throw new UnauthorizedException('inavlid credentials');
        } catch (err) {
            throw new UnauthorizedException('inavlid credentials');
        }
    }
}

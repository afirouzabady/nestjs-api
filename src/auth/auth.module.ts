import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), 
  JwtModule.register({
    secret: process.env.API_SECRET,
    signOptions: {
      expiresIn: Number(process.env.API_SECRET_EXPIRY)
    }
  }),
  PassportModule.register({defaultStrategy: 'jwt'}),
],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, JwtStrategy, AuthService]
})
export class AuthModule {}

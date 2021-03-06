import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDTO, LoginDTO } from '../models/user.model';

@Controller('users')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post()
    register(@Body(ValidationPipe) credentials: { user: RegistrationDTO }) {
        return this.authService.register(credentials.user)

    }

    @Post('/login')
    login(@Body(ValidationPipe) credentials: { user:  LoginDTO }){
        return this.authService.login(credentials.user)
    }

}

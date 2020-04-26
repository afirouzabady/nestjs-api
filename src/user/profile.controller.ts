import { Controller, Get, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('profiles')
export class ProfileController {
    constructor(private userService: UserService){}

    @Get('/:username')
    @UseGuards(AuthGuard())
    async findProfile(@Param('username') username: string) {
        const user = await this.userService.findByUsername(username);
        if (!user) {
            throw new NotFoundException();
        }
        return user;
    }
}

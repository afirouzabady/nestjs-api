import { Controller, Get, Param, NotFoundException, UseGuards, Post, Delete, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../entities/user.entity';
import { User } from '../auth/user.decorator';
import { OptionalAuthGaurd } from '../auth/optinal-auth.gaurd';

@Controller('profiles')
export class ProfileController {
    constructor(private userService: UserService){}

    @Get('/:username')
    @UseGuards(new OptionalAuthGaurd()) 
    async findProfile(@Param('username') username: string, @User() user:UserEntity) {
        const profile = await this.userService.findByUsername(username, user);
        if (!profile) {
            throw new NotFoundException();
        }
        return {profile};
    }

    @Post('/:username/follow')
    @HttpCode(200)
    @UseGuards(AuthGuard())
    async followUser(@User() user: UserEntity, @Param('username') username: string){
        const profile = await this.userService.followUser(user, username);
        return {profile};
    }

    @Delete('/:username/follow')
    @UseGuards(AuthGuard())
   async unfollowUser(@User() user: UserEntity, @Param('username') username: string){
        const profile = await this.userService.unfollowUser(user, username);
        return {profile};
    }
}

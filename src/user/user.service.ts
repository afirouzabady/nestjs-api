import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from '../models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async findByUsername(
    username: string,
    user?: UserEntity,
  ): Promise<UserEntity> {
    return (
      await this.userRepo.findOne({
        where: { username },
        relations: ['followers'],
      })
    ).toProfile(user);
  }

  async unfollowUser(currentUser: UserEntity, username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['followers'],
    });
    user.followers = user.followers.filter(
      follower => follower.email !== currentUser.email,
    );
    await user.save();
    return user.toProfile(currentUser);
  }

  async followUser(currentUser: UserEntity, username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['followers'],
    });
    user.followers.push(currentUser);
    await user.save();
    return user.toProfile(currentUser);
  }
}

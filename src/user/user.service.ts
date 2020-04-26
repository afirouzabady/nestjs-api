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

  async findByUsername(username: string): Promise<UserEntity> {
    return this.userRepo.findOne({ where: { username } });
  }

  async updateUser(username: string, data: UpdateUserDTO) {
    await this.userRepo.update({ username }, data);
    return this.findByUsername(username);
  }

  async unfollowUser(currentUser: UserEntity, username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['followers'],
    });
    console.log(user)
    user.followers = user.followers.filter(
      follower => follower.email !== currentUser.email,
    );
    console.log(user)
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

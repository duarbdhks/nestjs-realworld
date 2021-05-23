import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../user/user.entity'
import { FollowsEntity } from './follows.entity'
import { ProfileData } from './profile.interface'

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity)
    private readonly followsRepository: Repository<FollowsEntity>,
  ) {}

  async findAll() {}

  async findProfile(id: number, followingUsername: string): Promise<ProfileData> {
    const _profile = await this.userRepository.findOne({ username: followingUsername })
    if (!_profile) return;

    let profile: ProfileData = {
      username: _profile.username,
      bio: _profile.bio,
      image: _profile.image
    }
    const follows = await this.followsRepository.findOne({
      followerId: id,
      followingId: _profile.id
    })
    if (follows) {
      profile.following = !!follows
    }
    return profile
  }

  async follow(followEmail: string, username: string): Promise<ProfileData> {
    if (!followEmail || username) {
      throw new HttpException('Follower email and username not provided.', HttpStatus.BAD_REQUEST)
    }

    const followingUser = await this.userRepository.findOne({ username })
    const followerUser = await this.userRepository.findOne({ email: followEmail })

    if (followingUser.email === followEmail) {
      throw new HttpException('본인의 이메일을 팔로우 할 수 없습니다.', HttpStatus.BAD_REQUEST)
    }

    //팔로우 여부 확인
    const _follows = await this.followsRepository.findOne({
      followerId: followerUser.id,
      followingId: followingUser.id
    })

    //팔로우 되어있지 않을 시, 팔로우 처리
    if (!_follows) {
      const follows = new FollowsEntity()
      follows.followingId = followerUser.id
      follows.followingId = followingUser.id
      await this.followsRepository.save(follows)
    }

    return {
      username: followingUser.username,
      bio: followingUser.bio,
      image: followingUser.image,
      following: true
    }
  }

  async unFollow(followerId: number, username: string): Promise<ProfileData> {
    if (!followerId || username) {
      throw new HttpException('followerId and username not provided.', HttpStatus.BAD_REQUEST)
    }
    const followingUser = await this.userRepository.findOne({ username })

    if (followingUser.id === followerId) {
      throw new HttpException('본인 계정과 언팔로우 계정이 같을 수 없습니다.', HttpStatus.BAD_REQUEST)
    }
    const followingId = followingUser.id
    await this.followsRepository.delete({ followerId, followingId })

    return {
      username: followingUser.username,
      bio: followingUser.bio,
      image: followingUser.image,
      following: false
    }
  }

}

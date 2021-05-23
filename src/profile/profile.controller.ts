import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { User } from '../user/user.decorator'
import { ProfileData } from './profile.interface'
import { ProfileService } from './profile.service'

@ApiBearerAuth()
@ApiTags('profiles')
@Controller('profiles')
export class ProfileController {

  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(
    @User('id') userId: number,
    @Param('username') username: string
  ): Promise<ProfileData> {
    return this.profileService.findProfile(userId, username)
  }

  @Post(':username/follow')
  async follow(
    @User('email') email: string,
    @Param('username') username: string
  ): Promise<ProfileData> {
    return this.profileService.follow(email, username)
  }

  @Delete(':username/folow')
  async unFollow(
    @User('id') userId: number,
    @Param('username') username: string
  ): Promise<ProfileData> {
    return this.profileService.unFollow(userId, username)
  }
}

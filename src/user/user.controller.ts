import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { User } from './user.decorator'
import { UserRO } from './user.interface'
import { UserService } from './user.service'

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findMe(@User('email') email: string): Promise<UserRO> {
    console.log(email,'aaaaa')
    return this.userService.findByEmail(email)
  }

}

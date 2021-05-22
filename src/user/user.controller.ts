import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import { ValidationPipe } from '../shared/pipes/validation.pipe'
import { CreateUserDto } from './dto'
import { User } from './user.decorator'
import { UserRO } from './user.interface'
import { UserService } from './user.service'

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async findMe(@User('email') email: string): Promise<UserRO> {
    return this.userService.findByEmail(email)
  }

  @UsePipes(new ValidationPipe())
  @ApiBody({ type: [CreateUserDto] })
  @Post()
  async create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData)
  }

}

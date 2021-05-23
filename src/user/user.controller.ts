import { Body, Controller, Get, HttpException, HttpStatus, Post, Put, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import { ValidationPipe } from '../shared/pipes/validation.pipe'
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto'
import { User } from './user.decorator'
import { UserData, UserRO } from './user.interface'
import { UserService } from './user.service'

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 유저 조회 By Eamil
   * @param email
   */
  @Get('')
  async findMe(@User('email') email: string): Promise<UserRO> {
    return this.userService.findByEmail(email)
  }

  /**
   * 유저 정보 수정
   * @param userId
   * @param userData
   */
  @Put()
  async update(@User('id') userId: number, @Body() userData: UpdateUserDto) {
    return await this.userService.update(userId, userData)
  }

  /**
   * 유저 생성
   * @param userData
   */
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: [CreateUserDto] })
  @Post()
  async create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData)
  }

  /**
   * 로그인
   * @param loginUserDto
   */
  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserData> {
    const _user = await this.userService.findOne(loginUserDto)

    if (!_user) {
      const errors = { User: 'Not Found' }
      throw new HttpException({ message: '', errors }, HttpStatus.UNAUTHORIZED)
    }

    const token = await this.userService.generateToken(_user)
    console.log(token, 'duarbdhks token')
    const { email, username, bio, image } = _user;
    return Object.assign({ token }, { email, username, bio, image })
  }

}

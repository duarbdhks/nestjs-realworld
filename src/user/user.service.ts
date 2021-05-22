import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { validate } from 'class-validator'
import { getRepository, Repository } from 'typeorm'
import { CreateUserDto } from './dto'
import { UserEntity } from './user.entity'
import { UserRO } from './user.interface'

const jwt = require('jsonwebtoken')

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find()
  }

  async create(userData: CreateUserDto): Promise<UserRO> {
    //체크 email/password
    const { username, email, password } = userData
    const qb = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .orWhere('user.email = :email', { email })

    const user = await qb.getOne()
    if (user) {
      const errors = { username: 'Username and email must be unique.' }
      throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.BAD_REQUEST)
    }

    //create user
    let newUser = new UserEntity()
    newUser.username = username
    newUser.email = email
    newUser.password = password
    // newUser.articles = []

    const errors = await validate(newUser)
    if (errors.length > 0) {
      const _errors = { username: 'User input is not valid.' }
      throw new HttpException({ message: 'Input data validation failed', _errors }, HttpStatus.BAD_REQUEST)
    } else {
      const saveUser = await this.userRepository.save(newUser)
      return this.buildUserRO(saveUser)
    }
  }

  async findById(id: number): Promise<UserRO> {
    const user = await this.userRepository.findOne(id)

    if (!user) {
      const errors = { User: 'Not Found' }
      throw new HttpException({ errors }, 401)
    }

    return this.buildUserRO(user)
  }

  async findByEmail(email: string): Promise<UserRO> {
    const user = await this.userRepository.findOne({ email })

    if (!user) {
      const errors = { User: 'Not Found' }
      throw new HttpException({ errors }, 401)
    }

    return this.buildUserRO(user)
  }

  private generateToken(user: UserEntity) {
    let today = new Date()
    let exp = new Date(today)
    exp.setDate(today.getDate() + 60)

    return jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
      exp: exp.getTime() / 1000
    }, process.env.SECRET)
  }

  private buildUserRO(user: UserEntity) {
    console.log(user, 'buildUserRO')
    const userRO = {
      id: user.id,
      username: user.username,
      email: user.email,
      token: this.generateToken(user),
      bio: user.bio,
      image: user.image
    }
    return { user: userRO }
  }
}

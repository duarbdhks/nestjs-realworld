import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
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

  async findById(id: number): Promise<UserRO> {
    const user = await this.userRepository.findOne(id)

    if (!user) {
      const errors = { User: 'Not Found' }
      throw new HttpException({ errors }, 401)
    }

    return this.buildUserRO(user)
  }

  async findByEmail(email: string): Promise<UserRO> {
    console.log(email, 111)
    const user = await this.userRepository.findOne({ email })
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
    console.log(user,2222)
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

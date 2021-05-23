import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express'
import { IUserRequest } from './user.interface'
import { UserService } from './user.service'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: IUserRequest, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1]
      const decoded = jwt.verify(token, process.env.SECRET)
      const user = await this.userService.findById(decoded.id)

      if (!user) {
        throw new HttpException('User Not found.', HttpStatus.UNAUTHORIZED)
      }

      req.user = user.user
      next();
    } else {
      throw new HttpException('Not Authorized.', HttpStatus.UNAUTHORIZED)
    }
  }
}

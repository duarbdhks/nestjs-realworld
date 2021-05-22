import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest()

  //user 데이터는 는 middleware 에서 설정
  if (!!req.user) {
    return !!data ? req.user[data] : req.user;
  }

  //jwt 형태로 인증을 받을 수 있음.
  const token = req.headers.authorization ? (req.headers.authorization as string).split(' ') : null;
  if (token && token[1]) {
    const decoded = jwt.verify(token[1], process.env.SECRET)
    return !!data ? decoded[data] : decoded.user;
  }
})

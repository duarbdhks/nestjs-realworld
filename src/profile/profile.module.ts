import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthMiddleware } from '../user/auth.middleware'
import { UserEntity } from '../user/user.entity'
import { UserModule } from '../user/user.module'
import { FollowsEntity } from './follows.entity'
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FollowsEntity]),
    UserModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'profiles/:username/follow', method: RequestMethod.ALL }
    )
  }
}

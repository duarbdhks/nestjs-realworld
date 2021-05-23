import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Connection } from 'typeorm'
import { AppController } from './app.controller';
import { typeormConfig } from './ormconfig'
import { TagModule } from './tag/tag.module'
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    UserModule,
    TagModule,
    ProfileModule
  ],
  controllers: [AppController,],
  providers: [],
})
export class AppModule {
  constructor(private readonly connection: Connection) {
  }
}

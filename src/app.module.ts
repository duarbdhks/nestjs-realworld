import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Connection } from 'typeorm'
import { AppController } from './app.controller';
import { typeormConfig } from './ormconfig'
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    UserModule
  ],
  controllers: [AppController, ],
  providers: [],
})
export class AppModule {
  constructor(private readonly connection: Connection) {
  }
}

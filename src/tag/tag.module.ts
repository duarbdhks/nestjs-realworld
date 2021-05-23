import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '../user/user.module'
import { TagController } from './tag.controller';
import { TagEntity } from './tag.entity'
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity]), UserModule],
  controllers: [TagController],
  providers: [TagService]
})
export class TagModule {
}

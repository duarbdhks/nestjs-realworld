import { IsEmail } from 'class-validator'
import { BeforeInsert, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import * as argin2 from 'argon2'

@Entity('user')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string

  @Column({ default: '' })
  bio: string

  @Column({ default: '' })
  image: string

  @Column()
  password: string

  @BeforeInsert()
  async hashPassword() {
    this.password = await argin2.hash(this.password)
  }

}
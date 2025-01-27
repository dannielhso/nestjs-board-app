import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
      TypeOrmModule.forFeature([User]), // Board 엔터티를 TypeORM 모듈에 등록.
    ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}

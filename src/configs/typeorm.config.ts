import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    name: process.env.DB_USER,
    password: process.env.DB_PW,
    port: Number(process.env.DB_PORT), // 문자열 => 숫자로.
    database: process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true, // 개발중에만 true로 설정.
    logging: true, // SQL 로그가 출력.
};
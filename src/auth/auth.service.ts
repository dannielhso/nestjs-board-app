import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { UserRole } from './users-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    // 회원 가입 기능
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { username, password, email, role } = createUserDto;
        if (!username || !password || !email || !role) {
            throw new BadRequestException('Something went wrong.')
        }

        await this.checkEmailExist(email);

        const hashedPassword = await this.hashPassword(password);

        const newUser: User = {
            id: 0,
            username,
            password: hashedPassword,
            email,
            role: UserRole.USER
        }
        const createUser = await this.userRepository.save(newUser)
        return createUser
    }    

    async checkEmailExist(email: string): Promise<void> {
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if(existingUser){
            throw new ConflictException('Email already exists.');
        }
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(); // 솔트 생성 : 비밀번호를 해싱할 때 추가되는 보안성을 위한 난수.
        return await bcrypt.hash(password, salt); // 비밀번호 해싱.
    }
}

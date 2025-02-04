import { ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { User } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
    ){}

    // Sign-In
    async signIn(signInRequestDto : SignInRequestDto): Promise<string> {
        this.logger.verbose(`Visitor is creating a new account with email: ${signInRequestDto.email}`);

        const { email, password } = signInRequestDto;

        try{
            const existingUser = await this.findUserByEmail(email);
            
            if(!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // [1] JWT 토큰 생성
            const payload = {
                id: existingUser.id,
                email: existingUser.email,
                username: existingUser.username,
                role: existingUser.role
            };
            const accessToken = await this.jwtService.sign(payload);

            this.logger.verbose(`User with email: ${signInRequestDto.email} issued JWT ${accessToken}`);

            return accessToken;
        } catch (error) {
            this.logger.error('Invalid credentials or Internal error');
            throw error;
        }
    }

    async findUserByEmail(email: string): Promise<User> {
        const existingUser = await this.userService.findUserByEmail(email);
        if(!existingUser){
            throw new NotFoundException('User not found');
        }
        return existingUser;
    }

    async checkEmailExist(email: string): Promise<void> {
        const existingUser = await this.userService.findUserByEmail(email);
        if(existingUser){
            throw new ConflictException('Email already exists.');
        }
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(); // 솔트 생성 : 비밀번호를 해싱할 때 추가되는 보안성을 위한 난수.
        return await bcrypt.hash(password, salt); // 비밀번호 해싱.
    }
}

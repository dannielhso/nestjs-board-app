import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // 회원 가입 기능
    @Post('/signup')
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const userResponseDto = new UserResponseDto(await this.authService.createUser(createUserDto))
        return userResponseDto
    }

    // 로그인 기능
    @Post('/signin') 
    async signIn(@Body() loginUserDto: LoginUserDto, @Res() res: Response): Promise<void> {
        const accessToken = await this.authService.signIn(loginUserDto);

        // [2] JWT를 쿠키에 저장
        res.cookie('Authorization', accessToken, {
            httpOnly: true, // 클라이언트 측 스크립트에서 쿠키 접근 금지
            secure: false, // HTTPS에서만 쿠키 전송, 임시 비활성화
            maxAge: 3600000, // 1시간
            sameSite: 'none', // CSRF 공격 방어
        });

        res.send({ message: 'Logged in successfully' });
    }

}

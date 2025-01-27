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
        res.cookie('Authorization', accessToken, { // 'Authorization' 은 쿠키의 이름이다.
            httpOnly: true,
            secure: false,
            maxAge: 3600000,
            sameSite: 'none',
        });

        res.send({ message: 'Logged in successfully' });
    }

}

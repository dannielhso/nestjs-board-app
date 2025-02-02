import { Body, Controller, Logger, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { SignInRequestDto } from './dto/sign-in-request.dto';

@Controller('api/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(
        private authService: AuthService
    ) {}

    // 회원 가입 기능
    @Post('/signup')
    async signUp(@Body() singUpRequsetDto: SignUpRequestDto): Promise<UserResponseDto> {
        this.logger.verbose(`Visiter is try to creating a new account with email: ${singUpRequsetDto.email}`);

        const userResponseDto = new UserResponseDto(await this.authService.createUser(singUpRequsetDto))

        this.logger.verbose(`New account email with ${singUpRequsetDto.email} created successfully`);
        return userResponseDto
    }

    // 로그인 기능
    @Post('/signin')
    async signIn(@Body() signInRequestDto: SignInRequestDto, @Res() res:Response): Promise<void> {
        this.logger.verbose(`User with email: ${signInRequestDto.email} is try to signing in`);

        const accessToken = await this.authService.signIn(signInRequestDto);

        // [2] JWT를 쿠키에 저장
        res.setHeader('Authorization', accessToken);
        
        res.send({message: "Login Success", accessToken});
     
        this.logger.verbose(`User with email: ${signInRequestDto.email} issued JWT ${accessToken}`);
    }
}

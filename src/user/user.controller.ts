import { Body, Controller, Logger, Post } from '@nestjs/common';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  // CREATE
      @Post('/')
      async signUp(@Body() createUserRequestDto: CreateUserRequestDto): Promise<UserResponseDto> {
          this.logger.verbose(`Visiter is try to creating a new account with email: ${createUserRequestDto.email}`);
  
          const userResponseDto = new UserResponseDto(await this.userService.createUser(createUserRequestDto))
  
          this.logger.verbose(`New account email with ${createUserRequestDto.email} created successfully`);
          return userResponseDto
      }
}
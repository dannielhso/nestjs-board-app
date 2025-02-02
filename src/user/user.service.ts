import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UserRole } from 'src/user/user-role.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    constructor(
            @InjectRepository(User)
            private userRepository: Repository<User>,
        ){}
    // CREATE
    async createUser(createUserRequestDto: CreateUserRequestDto): Promise<User> {
        this.logger.verbose(`Visitor is creating a new account with email: ${createUserRequestDto.email}`);
    
        const { username, password, email, role } = createUserRequestDto;
        if (!username || !password || !email || !role) {
            throw new BadRequestException('Something went wrong.')
        }
    
        await this.checkEmailExist(email);

        const hashedPassword = await this.hashPassword(password);
    
        const newUser = this.userRepository.create({
            username,
            password: hashedPassword,
            email,
            role,
        });
    
        const createUser = await this.userRepository.save(newUser)
    
        this.logger.verbose(`User with email ${createUserRequestDto.email} is signing in`);
    
        return createUser
    }
    // READ - by email
    async findUserByEmail(email: string): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if(!existingUser){
            throw new NotFoundException('User not found');
        }
        return existingUser;
    }
    
    // Existing Checker
    async checkEmailExist(email: string): Promise<void> {
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if(existingUser){
            throw new ConflictException('Email already exists.');
        }
    }
    
    // Hashing Password
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }
}

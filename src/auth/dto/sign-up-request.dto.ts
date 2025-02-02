import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { UserRole } from "../user-role.enum";

export class SignUpRequestDto {
    @IsNotEmpty() // 빈 값이 아닌지 체크
    @IsString() // 문자열인지 체크
    @MinLength(2) // 2글자 이상인지 체크
    @MaxLength(20) // 20글자 이하인지 체크크
    @Matches(/^[가-힣]+$/, { message: 'Username is invalid'})
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'Password too weak', })
    password: string;
    
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @MaxLength(100)
    email: string;

    @IsNotEmpty()
    @IsEnum(UserRole) // UserRole Enum에 속하는지 체크.
    role: UserRole;
}
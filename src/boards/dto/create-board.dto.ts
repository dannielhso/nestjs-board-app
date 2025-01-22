import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateBoardDto {
    @IsNotEmpty()  // null값을 허용하지 않음.
    @IsString()    // string 값만 허용.
    author : string;

    @IsString()
    @IsNotEmpty()
    title : string;

    @IsString()
    @IsNotEmpty()
    contents : string;

    // @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'Password too weak', }) // 대문자 소문자 숫자 특수문자 포함 8자 이상
    // password: string;
}
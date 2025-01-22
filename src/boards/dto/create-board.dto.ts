import { IsNotEmpty, IsString } from "class-validator";

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
}
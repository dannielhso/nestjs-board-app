import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateBoardDto {
    @IsString()
    @IsNotEmpty()
    title : string;

    @IsString()
    @IsNotEmpty()
    contents : string;
}
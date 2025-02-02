import { IsNotEmpty, IsString } from "class-validator";

export class CreateArticleRequestDto {
    @IsString()
    @IsNotEmpty()
    title : string;

    @IsString()
    @IsNotEmpty()
    contents : string;
}
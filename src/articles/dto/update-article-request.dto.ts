import { IsNotEmpty, IsString } from "class-validator";

export class UpdateArticleResponseDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    contents: string;
}
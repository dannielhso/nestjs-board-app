import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UsePipes, ValidationPipe,  } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { CreateArticleRequestDto } from './dto/create-article-request.dto';
import { ArticleStatus } from './article-status.enum';
import { UpdateArticleResponseDto,  } from './dto/update-article-request.dto';
import { ArticleStatusValidationPipe } from './pipes/article-status-validation.pipe';
import { ArticleResponseDto } from './dto/article-response.dto';
import { SearchArticleResponseDto } from './dto/search-article-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/user/user-role.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/user.entity';

@Controller('api/articles')
@UseGuards(AuthGuard(), RolesGuard)
export class ArticleController {
    private readonly logger = new Logger(ArticleController.name);

    constructor(private articlesService :ArticleService) {}

    // CREATE
    @Post('/')
    async createArticle(@Body() createArticleRequestDto: CreateArticleRequestDto, @GetUser() logginedUser: User): Promise<ArticleResponseDto> {
        this.logger.verbose(`User ${logginedUser.username} is trying to create a new article with title: ${createArticleRequestDto.title}`);

        const articleResponseDto = new ArticleResponseDto(await this.articlesService.createArticle(createArticleRequestDto, logginedUser));

        this.logger.verbose(`Article title whit ${articleResponseDto.title} created Successfully`);
        return articleResponseDto;
    }

    // READ - all
    @Get('/')
    @Roles(UserRole.USER)
    async getAllArticleList(): Promise<ArticleResponseDto[]> {
        this.logger.verbose(`Retrieving all Articles`);

	    const boars: Article[] = await this.articlesService.getAllArticleList();
        const ArticlesResponseDto = boars.map(article => new ArticleResponseDto(article));

        this.logger.verbose(`Retrieving all Articles Successfully`);
        return ArticlesResponseDto;
    }

    // READ - by Loggined User
    @Get('/myarticles')
    async getMyAllArticles(@GetUser() logginedUser: User): Promise<ArticleResponseDto[]> {
        this.logger.verbose(`Retrieving ${logginedUser.username}'s all Articles`);

        const boars: Article[] = await this.articlesService.getMyAllArticleList(logginedUser);
        const ArticlesResponseDto = boars.map(article => new ArticleResponseDto(article));

        this.logger.verbose(`Retrieving ${logginedUser.username}'s all Articles list Successfully`);
        return ArticlesResponseDto;
    }

    // READ - by id
    @Get('/:id')
    @UsePipes(ValidationPipe)
    async getArticleDetailById(@Param('id') id:number): Promise<ArticleResponseDto> {
        this.logger.verbose(`Retrieving Article by id: ${id}`);

        const article: Article = await this.articlesService.getArticleDetailById(id);

        this.logger.verbose(`Retrieving a article by ${id} details Successfully`);
	    return new ArticleResponseDto(article);
    }

    // READ - by keyword
    @Get('/search/:keyword')
    async getArticlesByKeyword(@Query('author') author:string): Promise<SearchArticleResponseDto[]> {
        this.logger.verbose(`Retrieving article by id: ${author}`);

        const boars: Article[] = await this.articlesService.getArticleListByKeyword(author);
        const ArticlesResponseDto = boars.map(article => new SearchArticleResponseDto(article));
	    
        this.logger.verbose(`Retrieving articles list by ${author} details Successfully`);
        return ArticlesResponseDto;
    }

    // UPDATE - by id 
    @Put('/:id')
    async updateArticleById(
        @Param('id') id: number,
        @Body() updateArticleResponseDto: UpdateArticleResponseDto): Promise<SearchArticleResponseDto> {
            this.logger.verbose(`Updating a article by id: ${id} with updaiteArticleDto`);
            
            const ArticleResponseDto = new SearchArticleResponseDto(await this.articlesService.updateArticleById(id, updateArticleResponseDto));
            
            this.logger.verbose(`Updated a articles list by ${id} Successfully`);
            return ArticleResponseDto;
        }

    // UPDATE - status <ADMIN>
    @Patch('/:id')
    @Roles(UserRole.ADMIN)
    async updateArticleStatusById(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', ArticleStatusValidationPipe) status: ArticleStatus): Promise<void>{
        this.logger.verbose(`Updating a article by id: ${id} with status: ${status}`);

        await this.articlesService.updateArticleStatusById(id, status);
        
        this.logger.verbose(`Updated a article's by ${id} status to ${status} Successfully`);
    }

    // DELETE - by id
    @Delete('/:id')
    @Roles(UserRole.USER, UserRole.ADMIN)
    async deleteArticleById(@Param('id') id: number, @GetUser() logginedUser: User): Promise<void> {
        this.logger.verbose(`User: ${logginedUser.username} is Delete a article by id: ${id}`);

        await this.articlesService.deleteArticleById(id, logginedUser);

        this.logger.verbose(`Deleted a article by ${id} Successfully`);
    }
}

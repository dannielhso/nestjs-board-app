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
import { Roles } from 'src/auth/dto/roles.decorator';
import { UserRole } from 'src/auth/user-role.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('api/articles') // 컨트롤러의 end 포인트 지정.
@UseGuards(AuthGuard(), RolesGuard)
export class ArticleController {
    private readonly logger = new Logger(ArticleController.name);
    // 생성자 주입
    constructor(private articlesService :ArticleService) {}

    //게시글 작성 기능
    @Post('/')
    async createArticle(@Body() createArticleRequestDto: CreateArticleRequestDto, @GetUser() logginedUser: User): Promise<ArticleResponseDto> {
        this.logger.verbose(`User ${logginedUser.username} is trying to create a new article with title: ${createArticleRequestDto.title}`);

        const articleResponseDto = new ArticleResponseDto(await this.articlesService.createArticle(createArticleRequestDto, logginedUser));

        this.logger.verbose(`Article title whit ${articleResponseDto.title} created Successfully`);
        return articleResponseDto;
    }

    // 게시글 조회 기능
    @Get('/')
    @Roles(UserRole.USER) // 로그인 유저가 USER일 때만 접근 가능
    async getAllArticleList(): Promise<ArticleResponseDto[]> {
        this.logger.verbose(`Retrieving all Articles`);

	    const boars: Article[] = await this.articlesService.getAllArticleList();
        const ArticlesResponseDto = boars.map(article => new ArticleResponseDto(article));

        this.logger.verbose(`Retrieving all Articles Successfully`);
        return ArticlesResponseDto;
    }

    // 나의 게시글 조회 기능(로그인 유저)
    @Get('/myarticles')
    async getMyAllArticles(@GetUser() logginedUser: User): Promise<ArticleResponseDto[]> {
        this.logger.verbose(`Retrieving ${logginedUser.username}'s all Articles`);

        const boars: Article[] = await this.articlesService.getMyAllArticleList(logginedUser);
        const ArticlesResponseDto = boars.map(article => new ArticleResponseDto(article));

        this.logger.verbose(`Retrieving ${logginedUser.username}'s all Articles list Successfully`);
        return ArticlesResponseDto;
    }

    // 특정 게시글 조회 기능
    @Get('/:id')
    @UsePipes(ValidationPipe)
    async getArticleDetailById(@Param('id') id:number): Promise<ArticleResponseDto> {
        this.logger.verbose(`Retrieving Article by id: ${id}`);

        const article: Article = await this.articlesService.getArticleDetailById(id);

        this.logger.verbose(`Retrieving a article by ${id} details Successfully`);
	    return new ArticleResponseDto(article);
    }

    // 키워드(작성자)로 검색한 게시글 조회 기능
    @Get('/search/:keyword')
    async getArticlesByKeyword(@Query('author') author:string): Promise<SearchArticleResponseDto[]> {
        this.logger.verbose(`Retrieving article by id: ${author}`);

        const boars: Article[] = await this.articlesService.getArticleListByKeyword(author);
        const ArticlesResponseDto = boars.map(article => new SearchArticleResponseDto(article));
	    
        this.logger.verbose(`Retrieving articles list by ${author} details Successfully`);
        return ArticlesResponseDto;
    }

    // 특정 번호의 게시글 수정
    @Put('/:id')
    async updateArticleById(
        @Param('id') id: number,
        @Body() updateArticleResponseDto: UpdateArticleResponseDto): Promise<SearchArticleResponseDto> {
            this.logger.verbose(`Updating a article by id: ${id} with updaiteArticleDto`);
            
            const ArticleResponseDto = new SearchArticleResponseDto(await this.articlesService.updateArticleById(id, updateArticleResponseDto));
            
            this.logger.verbose(`Updated a articles list by ${id} Successfully`);
            return ArticleResponseDto;
        }

    // 특정 번호 게시글 일부 수정 <ADMIN 기능>
    @Patch('/:id')
    @Roles(UserRole.ADMIN)
    async updateArticleStatusById(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', ArticleStatusValidationPipe) status: ArticleStatus): Promise<void>{
        this.logger.verbose(`Updating a article by id: ${id} with status: ${status}`);

        await this.articlesService.updateArticleStatusById(id, status);
        
        this.logger.verbose(`Updated a article's by ${id} status to ${status} Successfully`);
    }

    // 게시글 삭제 기능
    @Delete('/:id')
    @Roles(UserRole.USER, UserRole.ADMIN)
    async deleteArticleById(@Param('id') id: number, @GetUser() logginedUser: User): Promise<void> {
        this.logger.verbose(`User: ${logginedUser.username} is Delete a article by id: ${id}`);

        await this.articlesService.deleteArticleById(id, logginedUser);

        this.logger.verbose(`Deleted a article by ${id} Successfully`);
    }
}

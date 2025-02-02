import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Article } from './article.entity';
import { ArticleStatus } from './article-status.enum';
import { CreateArticleRequestDto } from './dto/create-article-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateArticleResponseDto } from './dto/update-article-request.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class ArticleService {
    private readonly logger = new Logger(ArticleService.name);

    constructor(
        @InjectRepository(Article)
        private articleRepository: Repository<Article>
    ){}

    // CREATE
    async createArticle(createArticleRequestDto: CreateArticleRequestDto, logginedUser: User): Promise<Article> {
        this.logger.verbose(`User ${logginedUser.username} is a creating a new article with title: ${createArticleRequestDto.title}`);

        const { title, contents } = createArticleRequestDto;
        if (!title || !contents) {
            this.logger.error(`Title, and contents must be provided`);
            throw new BadRequestException('Title, and contents must be provided');
        }

        const newArticle = this.articleRepository.create({
            author: logginedUser.username,
            title,
            contents,
            status: ArticleStatus.PUBLIC,
            user: logginedUser,
        });

        const createArticle = await this.articleRepository.save(newArticle);

        this.logger.verbose(`Article title whit ${createArticle.title} created Successfully`);
        return createArticle;
    }
    
    // READ - all
    async getAllArticleList(): Promise<Article[]> {
        this.logger.verbose(`Retrieving all Articles`);

        const foundArticles = await this.articleRepository.find();

        this.logger.verbose(`Retrieving all Articles Successfully`);
        return foundArticles;
    }

    // READ - by Loggined User
    async getMyAllArticleList(logginedUser): Promise<Article[]> {
        this.logger.verbose(`Retrieving ${logginedUser.username}'s all Articles`);

        const foundArticles = await this.articleRepository.createQueryBuilder('article')
            .leftJoinAndSelect('article.user', 'user')
            .where('article.userId = :userId', { userId : logginedUser.id })
            .getMany();

        this.logger.verbose(`Retrieving ${logginedUser.username}'s all Articles list Successfully`);
        return foundArticles;
    }

    // READ - by id
    async getArticleDetailById(id: number): Promise<Article> {
        this.logger.verbose(`Retrieving Article by id: ${id}`);

        const foundArticle = await this.articleRepository.createQueryBuilder('article')
            .leftJoinAndSelect('article.user', 'user')
            .where('article.id = :id', { id })
            .getOne();

        if(!foundArticle){
            throw new NotFoundException (`Article whit id ${id} is not found.`);
        }

        this.logger.verbose(`Retrieving a article by ${id} details Successfully`);
        return foundArticle;
    }

    // READ - by keyword
    async getArticleListByKeyword(author: string): Promise<Article[]> {
        this.logger.verbose(`Retrieving article by id: ${author}`);

        if(!author){
            throw new BadRequestException ('Author keyword must be provided.');
        }

        const foundArticles = await this.articleRepository.findBy({author: author});

        if(!foundArticles){
            throw new NotFoundException (`Article whit author ${author} is not found.`)
        }

        this.logger.verbose(`Retrieving articles list by ${author} details Successfully`);
        return foundArticles;
    }

    // UPDATE - by id
    async updateArticleById(id: number, updateArticleResponseDto: UpdateArticleResponseDto): Promise<Article> {
        this.logger.verbose(`Updating a article by id: ${id} with updaiteArticleDto`);

        const foundArticle = await this.getArticleDetailById(id);
        const {title, contents} = updateArticleResponseDto;
        if(!title || !contents){
            throw new BadRequestException('Title and Contents must be provided.');
        }
        foundArticle.title = title;
        foundArticle.contents = contents; 
        const updatedArticle = await this.articleRepository.save(foundArticle);

        this.logger.verbose(`Updated a articles list by ${id} Successfully`);
        return updatedArticle;
    }

    // UPDATE - status <ADMIN>
    async updateArticleStatusById(id: number, status: ArticleStatus): Promise<void> {
        this.logger.verbose(`Updating a article by id: ${id} with status: ${status}`);

        const result = await this.articleRepository.update(id, { status });
        if (result.affected === 0) {
            throw new NotFoundException (`Article whit ID ${id} is not found.`)
        }

        this.logger.verbose(`Updated a article's by ${id} status to ${status} Successfully`);
    }

    // DELETE
    async deleteArticleById(id: number, logginedUser: User): Promise<void> {
        this.logger.verbose(`User: ${logginedUser.username} is Delete a article by id: ${id}`);

        const foundArticle = await this.getArticleDetailById(id);
        
        if (foundArticle.user.id !== logginedUser.id) {
            throw new UnauthorizedException(`You do not have permission to delete this article.`);
        }

        await this.articleRepository.remove(foundArticle);

        this.logger.verbose(`Deleted a article by ${id} Successfully`);
    }
}

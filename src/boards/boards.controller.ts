import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UsePipes, ValidationPipe,  } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './boards.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatus } from './boards-status.enum';
import { UpdateBoardDto,  } from './dto/update-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { BoardResponseDto } from './dto/board-response.dto';
import { BoardSearchResponseDto } from './dto/board-search-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-role.guard';
import { Roles } from 'src/auth/dto/roles.decorator';
import { UserRole } from 'src/auth/users-role.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/users.entity';

@Controller('api/boards') // 컨트롤러의 end 포인트 지정.
@UseGuards(AuthGuard(), RolesGuard)
export class BoardsController {
    private readonly logger = new Logger(BoardsController.name);
    // 생성자 주입
    constructor(private boardsService :BoardsService) {}

    //게시글 작성 기능
    @Post('/')
    async createBoard(@Body() createBoardDto: CreateBoardDto, @GetUser() logginedUser: User): Promise<BoardResponseDto> {
        this.logger.verbose(`User ${logginedUser.username} is trying to create a new board with title: ${createBoardDto.title}`);

        const boardResponseDto = new BoardResponseDto(await this.boardsService.createBoard(createBoardDto, logginedUser));

        this.logger.verbose(`Board title whit ${boardResponseDto.title} created Successfully`);
        return boardResponseDto;
    }

    // 게시글 조회 기능
    @Get('/')
    @Roles(UserRole.USER) // 로그인 유저가 USER일 때만 접근 가능
    async getAllBoards(): Promise<BoardResponseDto[]> {
        this.logger.verbose(`Retrieving all Boards`);

	    const boars: Board[] = await this.boardsService.getAllBoards();
        const BoardsResponseDto = boars.map(board => new BoardResponseDto(board));

        this.logger.verbose(`Retrieving all Boards Successfully`);
        return BoardsResponseDto;
    }

    // 나의 게시글 조회 기능(로그인 유저)
    @Get('/myboards')
    async getMyAllBoards(@GetUser() logginedUser: User): Promise<BoardResponseDto[]> {
        this.logger.verbose(`Retrieving ${logginedUser.username}'s all Boards`);

        const boars: Board[] = await this.boardsService.getMyAllBoards(logginedUser);
        const BoardsResponseDto = boars.map(board => new BoardResponseDto(board));

        this.logger.verbose(`Retrieving ${logginedUser.username}'s all Boards list Successfully`);
        return BoardsResponseDto;
    }

    // 특정 게시글 조회 기능
    @Get('/:id')
    @UsePipes(ValidationPipe)
    async getBoardDetailById(@Param('id') id:number): Promise<BoardResponseDto> {
        this.logger.verbose(`Retrieving Board by id: ${id}`);

        const board: Board = await this.boardsService.getBoardDetailById(id);

        this.logger.verbose(`Retrieving a board by ${id} details Successfully`);
	    return new BoardResponseDto(board);
    }

    // 키워드(작성자)로 검색한 게시글 조회 기능
    @Get('/search/:keyword')
    async getBoardsByKeyword(@Query('author') author:string): Promise<BoardSearchResponseDto[]> {
        this.logger.verbose(`Retrieving board by id: ${author}`);

        const boars: Board[] = await this.boardsService.getBoardsByKeyword(author);
        const BoardsResponseDto = boars.map(board => new BoardSearchResponseDto(board));
	    
        this.logger.verbose(`Retrieving boards list by ${author} details Successfully`);
        return BoardsResponseDto;
    }

    // 특정 번호의 게시글 수정
    @Put('/:id')
    async updateBoardById(
        @Param('id') id: number,
        @Body() updateBoardDto: UpdateBoardDto): Promise<BoardSearchResponseDto> {
            this.logger.verbose(`Updating a board by id: ${id} with updaiteBoardDto`);
            
            const BoardResponseDto = new BoardSearchResponseDto(await this.boardsService.updateBoardById(id, updateBoardDto));
            
            this.logger.verbose(`Updated a boards list by ${id} Successfully`);
            return BoardResponseDto;
        }

    // 특정 번호 게시글 일부 수정 <ADMIN 기능>
    @Patch('/:id')
    @Roles(UserRole.ADMIN)
    async updateBoardStatusById(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', BoardStatusValidationPipe) status: BoardStatus): Promise<void>{
        this.logger.verbose(`Updating a board by id: ${id} with status: ${status}`);

        await this.boardsService.updateBoardStatusById(id, status);
        
        this.logger.verbose(`Updated a board's by ${id} status to ${status} Successfully`);
    }

    // 게시글 삭제 기능
    @Delete('/:id')
    @Roles(UserRole.USER, UserRole.ADMIN)
    async deleteBoardById(@Param('id') id: number, @GetUser() logginedUser: User): Promise<void> {
        this.logger.verbose(`User: ${logginedUser.username} is Delete a board by id: ${id}`);

        await this.boardsService.deleteBoardById(id, logginedUser);

        this.logger.verbose(`Deleted a board by ${id} Successfully`);
    }
}

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UsePipes, ValidationPipe,  } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './boards.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatus } from './boards-status.enum';
import { UpdateBoardDto,  } from './dto/update-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { BoardResponseDto } from './dto/board-response.dto';
import { BoardSearchResponseDto } from './dto/board-search-response.dto';

@Controller('api/boards') // 컨트롤러의 end 포인트 지정.
export class BoardsController {
    // 생성자 주입
    constructor(private boardsService :BoardsService) {}

    // 게시글 조회 기능
    @Get('/')
    async getAllBoards(): Promise<BoardResponseDto[]> {
	    const boars: Board[] = await this.boardsService.getAllBoards();
        const BoardsResponseDto = boars.map(board => new BoardResponseDto(board));
        return BoardsResponseDto;
    }

    // 특정 게시글 조회 기능
    @Get('/:id')
    @UsePipes(ValidationPipe)
    async getBoardDetailById(@Param('id') id:number): Promise<BoardResponseDto> {
        const board: Board = await this.boardsService.getBoardDetailById(id);
	    return new BoardResponseDto(board);
    }

    // 키워드(작성자)로 검색한 게시글 조회 기능
    @Get('/search/:keyword')
    async getBoardsByKeyword(@Query('author') author:string): Promise<BoardSearchResponseDto[]> {
        const boars: Board[] = await this.boardsService.getBoardsByKeyword(author);
        const BoardsResponseDto = boars.map(board => new BoardSearchResponseDto(board));
	    return BoardsResponseDto;
    }

    //게시글 작성 기능
    @Post('/')
    async createBoard(@Body() createBoardDto: CreateBoardDto): Promise<string> {
        const createBoard = await this.boardsService.createBoard(createBoardDto);
        return createBoard;
    }

    // 특정 번호의 게시글 수정
    @Put('/:id')
    async updateBoardById(
        @Param('id') id: number,
        @Body() updateBoardDto: UpdateBoardDto): Promise<BoardResponseDto> {
            const BoardResponseDto = new BoardSearchResponseDto(await this.boardsService.updateBoardById(id, updateBoardDto));
            return BoardResponseDto;
        }

    // 특정 게시글 일부 수정 기능 PATCH
    @Patch('/:id')
    async updateBoardStatusById(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', BoardStatusValidationPipe) status: BoardStatus): Promise<void>{
        await this.boardsService.updateBoardStatusById(id, status);
    }

    // 게시글 삭제 기능
    @Delete('/:id')
    async deleteBoardById(@Param('id') id: number): Promise<void> {
        await this.boardsService.deleteBoardById(id);
    }
}

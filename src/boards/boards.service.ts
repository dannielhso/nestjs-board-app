import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './boards.entity';
import { BoardStatus } from './boards-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
    // Repository 계층 DI(의존성 주입)
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>
    ){}

    
    // 게시글 조회 기능
    async getAllBoards(): Promise<Board[]> {
        const foundBoards = await this.boardRepository.find();
        if(!foundBoards){
            throw new NotFoundException ('Board is not found.');
        }
        return foundBoards;
    }
    // 게시글이 없는 경우

    // 특정 게시글 조회
    async getBoardDetailById(insertId: number): Promise<Board> {
        const foundBoard = await this.boardRepository.findOneBy({id: insertId});
        if(!foundBoard){
            throw new NotFoundException (`Board whit id ${insertId} is not found.`);
        }
        return foundBoard;
    }
    // id가 없는 경우, 입력한 id가 number가 아닌 경우

    // 키워드(작성자)로 검색한 게시글 조회 기능
    async getBoardsByKeyword(insertAuthor: string): Promise<Board[]> {
        if(!insertAuthor){
            throw new BadRequestException ('Author keyword must be provided.');
        }
        const foundBoards = await this.boardRepository.findBy({author: insertAuthor});
        if(!foundBoards){
            throw new NotFoundException (`Board whit author ${insertAuthor} is not found.`)
        }
        return foundBoards;
    }
    // 게시글을 찾지 못한 경우

    //게시글 작성 기능
    async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
        const { author, title, contents } = createBoardDto;
    
        const board = this.boardRepository.create({
          author,
          title,
          contents,
          status: BoardStatus.PUBLIC,
        });
        return await this.boardRepository.save(board);
    }

    // 특정 번호의 게시글 수정
    async updateBoardById(id: number, updateBoardDto: UpdateBoardDto): Promise<Board> {
        const foundBoard = await this.getBoardDetailById(id); // 코드 재사용
        const {title, contents} = updateBoardDto;
        if(!title || !contents){
            throw new BadRequestException('Title and Contents must be provided.');
        }
        foundBoard.title = title;
        foundBoard.contents = contents; 
        const updatedBoard = await this.boardRepository.save(foundBoard);
        return updatedBoard;
    }
    // // 게시글이 없는 경우, 입력한 번호가 number타입이 아닌 경우, 제목이나 내용이 string타입이 아닌 경우

    // 특정 게시글 일부 수정 기능
    async updateBoardStatusById(id: number, status: BoardStatus): Promise<void> {
        const result = await this.boardRepository.update(id, { status });
        if (result.affected === 0) {
            throw new NotFoundException (`Board whit ID ${id} is not found.`)
        }
    }
    // 게시글이 없는 경우, 입력한 id가 number타입이 아닌 경우, 현재 상태로 변경하고자 하는 경우, 입력한 status가 PUBLIC이나 PRIVATE가 아닌 경우

    // 게시글 삭제 기능
    async deleteBoardById(id: number): Promise<void> {
        const foundBoard = await this.getBoardDetailById(id);
        this.boardRepository.delete(foundBoard);
    }
    // 게시글이 없는 경우, 입력한 id가 number타입이 아닌 경우, 
}

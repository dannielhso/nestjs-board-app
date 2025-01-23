import { BadRequestException, ConflictException, Injectable, NotFoundException, Param } from '@nestjs/common';
import { Board } from './boards.entity';
import { BoardStatus } from './boards-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardsRepository } from './boards-repository';

@Injectable()
export class BoardsService {
    // Repository 계층 DI(의존성 주입)
    constructor(private boardRepository: BoardsRepository){}

    
    // 게시글 조회 기능
    async getAllBoards(): Promise<Board[]> {
        const foundBoards = await this.boardRepository.findAll();
        return foundBoards;
    }
    // 게시글이 없는 경우

    // // 특정 게시글 조회
    // getBoardDetailById(id: number): Board {
    //     const foundBoard = this.boards.find((board) => board.id == id);
    //     if(!foundBoard) {
    //         throw new NotFoundException(`Board with ID ${id} is not found.`); // 찾지 못한 경우의 예외 처리.
    //     }
    //     return foundBoard;
    // }
    // // id가 없는 경우, 입력한 id가 number가 아닌 경우

    // // 키워드(작성자)로 검색한 게시글 조회 기능
    // getBoardsByKeyword(author: string): Board[] {
    //     const foundBoards =  this.boards.filter((board) => board.author == author);
    //     if(!foundBoards.length){
    //         throw new NotFoundException(`Boards with author ${author} is  found.`); // 찾지 못한 경우의 예외 처리.
    //     }
    //     return foundBoards;
    // }
    // // 게시글을 찾지 못한 경우

    //게시글 작성 기능
    createBoard(createBoardDto: CreateBoardDto) {
        const {author, title, contents} = createBoardDto;
        const board: Board = {
            id: this.boards.length + 1, // 임시 Auto Increment 기능
            author,
            title,
            contents,
            status: BoardStatus.PUBLIC,
        }
        const savedBoard = this.boards.push(board);
        return savedBoard;
    }
    // createBoardDto 형식에 맞지 않는 경우,

    // // 특정 번호의 게시글 수정
    // updateBoardById(id: number, updateBoardDto: UpdateBoardDto): Board {
    //     const foundBoard = this.getBoardDetailById(id); // 코드 재사용
    //     const {title, contents} = updateBoardDto;
    //     if(!title||!contents){
    //         throw new BadRequestException('Title and Contents must be provided.');
    //     }

    //     foundBoard.title = title;
    //     foundBoard.contents = contents;

    //     return foundBoard;
    // }
    // // 게시글이 없는 경우, 입력한 번호가 number타입이 아닌 경우, 제목이나 내용이 string타입이 아닌 경우

    // // 특정 게시글 일부 수정 기능
    // updateBoardStatusById(id: number, status: BoardStatus): Board {
    //     const foundBoard = this.getBoardDetailById(id); // 코드 재사용
    //     if(foundBoard.status == status){
    //         throw new ConflictException(`You are already in the ${status} status.`);
    //     }
    //     foundBoard.status = status;
    //     return foundBoard;
    // }
    // // 게시글이 없는 경우, 입력한 id가 number타입이 아닌 경우, 현재 상태로 변경하고자 하는 경우, 입력한 status가 PUBLIC이나 PRIVATE가 아닌 경우

    // // 게시글 삭제 기능
    // deleteBoardById(id: number): void {
    //     const foundBoard = this.boards.find((board) => board.id == id);
    //     if(!foundBoard) {
    //         throw new NotFoundException(`Board with ID ${id} is not found`); // 찾지 못한 경우의 예외 처리.
    //     }
    //     this.boards = this.boards.filter((board) => board.id != id);
    // }
    // // 게시글이 없는 경우, 입력한 id가 number타입이 아닌 경우, 
}

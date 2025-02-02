import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Board } from './boards.entity';
import { BoardStatus } from './boards-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBoardDto } from './dto/update-board.dto';
import { User } from 'src/auth/users.entity';
import { userInfo } from 'os';
import { UserRole } from 'src/auth/users-role.enum';

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
        return foundBoards;
    }

    // 로그인된 유저가 작성한 게시글 조회 기능
    async getMyAllBoards(logginedUser): Promise<Board[]> {
        // 기본 조회에서는 엔터티를 즉시로딩으로 변경해야 User에 접근할 수 있다.
        //const foundBoards = await this.boardRepository.findBy({ user: logginedUser });
        
        // 쿼리 빌더를 통해 lazy loading 설정된 엔터티와 관계를 가진 엔터티(User)에 명시적 접근이 가능하다.
        const foundBoards = await this.boardRepository.createQueryBuilder('board')
            .leftJoinAndSelect('board.user', 'user') // 사용자 정보를 조인(레이지 로딩 상태에서 User 추가 쿼리)
            .where('board.userId = :userId', { userId : logginedUser.id })
            .getMany();
        return foundBoards;
    }

    // 특정 게시글 조회
    async getBoardDetailById(id: number): Promise<Board> {
        const foundBoard = await this.boardRepository.createQueryBuilder('board')
            .leftJoinAndSelect('board.user', 'user')
            .where('board.id = :id', { id })
            .getOne();

        if(!foundBoard){
            throw new NotFoundException (`Board whit id ${id} is not found.`);
        }

        return foundBoard;
    }

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

    //게시글 작성 기능
    async createBoard(createBoardDto: CreateBoardDto, logginedUser: User): Promise<Board> {
        const { title, contents } = createBoardDto;
        if (!title || !contents) {
            throw new BadRequestException('Title, and contents must be provided');
        }
        const newBoard = this.boardRepository.create({
            author: logginedUser.username,
            title,
            contents,
            status: BoardStatus.PUBLIC,
            user: logginedUser,
        });
        const createBoard = await this.boardRepository.save(newBoard);
        return createBoard;
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

    // 특정 게시글 일부 수정 기능
    async updateBoardStatusById(id: number, status: BoardStatus): Promise<void> {
        const result = await this.boardRepository.update(id, { status });
        if (result.affected === 0) {
            throw new NotFoundException (`Board whit ID ${id} is not found.`)
        }
    }

    // 게시글 삭제 기능
    async deleteBoardById(id: number, logginedUser: User): Promise<void> {
        const foundBoard = await this.getBoardDetailById(id);
        // 작성자와 요청한 사용자가 같은지 확인.
        if (foundBoard.user.id !== logginedUser.id) {
            throw new UnauthorizedException(`You do not have permission to delete this board.`);
        }
        await this.boardRepository.remove(foundBoard);
    }
}

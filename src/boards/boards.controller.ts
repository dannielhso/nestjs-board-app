import { Controller, Get,  } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './boards.entity';

@Controller('boards') // 컨트롤러의 end 포인트 지정.
export class BoardsController {
    // 생성자 주입
    constructor(private boardsService :BoardsService) {}

    // 게시글 조회 기능
    @Get('/')
    getAllBoards(): Board[] {
	    return this.boardsService.getAllBoards();
    }
}

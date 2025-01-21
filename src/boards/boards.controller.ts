import { Controller, Get,  } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards') // 컨트롤러의 end 포인트 지정.
export class BoardsController {
    constructor(private boardsService :BoardsService) {}

    @Get('hello')
    async getHello(): Promise<string> {
	    return this.boardsService.hello();
    }
}

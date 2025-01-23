import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { createPool, Pool } from "mysql2/promise";
import { databaseConfig } from "src/configs/database.config";
import { Board } from "./boards.entity";

@Injectable()
export class BoardsRepository {
    private connectionPool: Pool;

    constructor() {
        this.connectionPool = createPool(databaseConfig);
        this.connectionPool.getConnection()
            .then(() => console.log('Database connected successfully'))
            .catch(err => console.error('Database connection failed:', err));
    }

    //게시글 조회
    async findAll(): Promise<Board[]> {
        const selectQuery = `SELECT * FROM board`;
        
        try {
            const [results] = await this.connectionPool.query(selectQuery);
            return results as Board[];
        } catch (err) {
            throw new InternalServerErrorException('Database query failed', err);
        }
    }

    // 게시글 작성
    async saveBoard(board: Board): Promise<string> {
        const insertQuery = `INSERT INTO board(author, title, contents, status) VALUE (?, ?, ?, ?)`;
        try {
            const result = await this.connectionPool.query(insertQuery, [board.author, board.title, board.contents, board.status]);
            const message = "Create success!";
            return message;
        } catch (err) {
            throw new InternalServerErrorException('Database query failed', err);
        }
    }
}
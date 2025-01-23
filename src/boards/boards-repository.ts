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

    async findAll(): Promise<Board[]> {
        const selectQuery = `SELECT * FROM board`;
        
        try {
            const [results] = await this.connectionPool.query(selectQuery);
            return results as Board[];
        } catch (err) {
            throw new InternalServerErrorException('Database query failed', err);
        }
    }
}
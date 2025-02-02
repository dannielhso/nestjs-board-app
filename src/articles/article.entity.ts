import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ArticleStatus } from "./article-status.enum";
import { User } from "src/auth/user.entity";

@Entity()
export class Article {
    @PrimaryGeneratedColumn() // PK + Auto_increment
    id: number;

    @Column() // General Column
    author: string;

    @Column()
    title: string;

    @Column()
    contents: string;

    @Column()
    status: ArticleStatus;

    @ManyToOne(Type => User, user => user.articles, { eager: false }) // ==lazy loading 상태
    user: User;
}
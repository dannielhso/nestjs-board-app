import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ArticleStatus } from "./article-status.enum";
import { User } from "src/user/user.entity";
import { CommonEntity } from "src/common/entities/common.entity";

@Entity()
export class Article extends CommonEntity {
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
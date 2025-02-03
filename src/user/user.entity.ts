import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./user-role.enum";
import { Article } from "src/article/article.entity";
import { CommonEntity } from "src/common/entities/common.entity";

@Entity()
export class  User extends CommonEntity {
    @Column()
    username: string;

    @Column()
    password: string;

    @Column({ unique: true})
    email: string;

    @Column()
    role: UserRole;

    @OneToMany(Type => Article, articles => articles.author, { eager: false }) //
    articles: Article[];
}
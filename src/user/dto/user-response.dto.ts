import { User } from "src/user/user.entity";
import { UserRole } from "../user-role.enum";

export class UserResponseDto {
    id: number;
    username: string;
    email: string
    role : UserRole

    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.role = user.role;
    }
}
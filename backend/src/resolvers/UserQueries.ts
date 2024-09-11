import { Resolver, Query } from "type-graphql";
import { User } from "../entities/User";

@Resolver(User)
export class UserQueries {
    @Query(() => [User])
    async getUsers() {
        const users = await User.find();
        return users;
    }
}

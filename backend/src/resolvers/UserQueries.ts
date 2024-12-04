import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import {
    Resolver,
    Query,
    Arg,
    Authorized,
    ObjectType,
    Field,
} from "type-graphql";

import { dataSource } from "../datasource";
import { User } from "../entities/User";

@ObjectType()
class LoginResponse {
    @Field()
    token!: string;

    @Field()
    userId!: string;
}

@Resolver(User)
export class UserQueries {
    @Authorized()
    @Query(() => [User])
    async getAllUsers(): Promise<User[]> {
        return await dataSource.manager.find(User, { relations: ["skills"] });
    }

    @Query(() => LoginResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string
    ): Promise<LoginResponse> {
        const user: User | null = await dataSource.manager.findOne(User, {
            where: { email },
        });

        if (!user) {
            throw new Error("Identifiants incorrects");
        }

        // argon2
        const isCorrectPassword: boolean = await argon2.verify(
            user.password,
            password
        );

        if (!isCorrectPassword) {
            throw new Error("Identifiants incorrects");
        }

        // jwt
        const jwtSecret: string | undefined = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("invalid JWT secret");
        }

        const token: string = jwt.sign({ email }, jwtSecret, {
            expiresIn: "24h",
        });

        return {
            token,
            userId: user.id!,
        };
    }

    @Query(() => User)
    async getUserByEmail(@Arg("email") email: string): Promise<User> {
        const user: User | null = await dataSource.manager.findOne(User, {
            relations: ["skills"],
            where: { email },
        });

        if (!user) {
            throw new Error("L'utilisateur n'existe pas");
        }

        return user;
    }

    @Query(() => Number)
    async getMangoBalanceByUserId(@Arg("id") id: string): Promise<number> {
        const user: User | null = await dataSource.manager.findOne(User, {
            select: { mangoBalance: true },
            where: { id },
        });

        if (!user) {
            throw new Error("L'utilisateur n'existe pas");
        }

        return user.mangoBalance;
    }

    @Query(() => Boolean)
    async credentialsVerification(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Arg("passwordConfirmation") passwordConfirmation: string
    ): Promise<Boolean> {
        const user: User | null = await dataSource.manager.findOne(User, {
            where: { email },
        });

        if (user) {
            throw new Error("L'adresse mail est déjà utilisée");
        }

        if (password !== passwordConfirmation) {
            throw new Error("Les mots de passe doivent être identiques");
        }

        // TO DO : Vérifier la robustesse du mot de passe ?

        return true;
    }
}

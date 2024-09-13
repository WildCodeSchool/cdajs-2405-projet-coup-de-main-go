import { Resolver, Query, Arg } from "type-graphql";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

import { User } from "../entities/User";
import logError from "../services/logError";

@Resolver(User)
export class UserQueries {
    @Query(() => [User])
    async getAllUsers(): Promise<User[]> {
        try {
            return await User.find({ relations: ["skills"] });
        } catch (error: unknown) {
            const message = "Erreur lors de la récupération des utilisateurs";
            logError(error, message);
            throw new Error(message);
        }
    }

    @Query(() => String)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string
    ): Promise<string> {
        let user: User | null;
        try {
            user = await User.findOne({
                where: { email },
            });

            if (!user) {
                throw new Error("incorrect identifiers");
            }
        } catch (error: unknown) {
            const message = "Erreur lors de la connexion";
            logError(error, message);
            throw new Error(message);
        }

        // argon2
        const isCorrectPassword: boolean = await argon2.verify(
            user.password,
            password
        );

        if (!isCorrectPassword) {
            throw new Error("incorrect identifiers");
        }

        // jwt
        const jwtSecret: string | undefined = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("invalid JWT secret");
        }

        return jwt.sign({ email }, jwtSecret, {
            expiresIn: "24h",
        });
    }

    @Query(() => User)
    async getUserByEmail(@Arg("email") email: string): Promise<User> {
        try {
            const user: User | null = await User.findOne({
                relations: ["skills"],
                where: { email },
            });

            if (!user) {
                throw new Error("user not found");
            }

            return user;
        } catch (error: unknown) {
            const message = "Erreur lors de la récupération de l'utilisateur";
            logError(error, message);
            throw new Error(message);
        }
    }

    @Query(() => Number)
    async getMangoBalanceByUserId(@Arg("id") id: string): Promise<Number> {
        try {
            const user: User | null = await User.findOne({
                select: { mangoBalance: true },
                where: { id },
            });

            if (!user) {
                throw new Error("user not found");
            }

            return user.mangoBalance;
        } catch (error: unknown) {
            const message =
                "Erreur lors de la récupération du solde de l'utilisateur";
            logError(error, message);
            throw new Error(message);
        }
    }
}

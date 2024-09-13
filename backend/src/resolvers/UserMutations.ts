import { Resolver, Mutation, Arg } from "type-graphql";
import * as argon2 from "argon2";

import { User } from "../entities/User";
import logError from "../services/logError";

@Resolver(User)
export class UserMutations {
    @Mutation(() => User)
    async register(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Arg("firstName") firstName: string,
        @Arg("lastName") lastName: string,
        @Arg("address") address: string,
        @Arg("zipCode") zipCode: string,
        @Arg("city") city: string
    ): Promise<User> {
        try {
            const isEmailUsed: User | null = await User.findOne({
                where: { email },
            });

            if (isEmailUsed) {
                throw new Error("email is already in use");
            }

            // argon2
            const passwordHashed: string = await argon2.hash(password);

            const newUser: User = User.create({
                email,
                password: passwordHashed,
                firstName,
                lastName,
                address,
                zipCode,
                city,
            });

            await newUser.save();

            return newUser;
        } catch (error: unknown) {
            const message = "Erreur lors de l'inscription";
            logError(error, message);
            throw new Error(message);
        }
    }

    @Mutation(() => Boolean)
    async deleteAccount(@Arg("id") id: string): Promise<Boolean> {
        try {
            const user: User | null = await User.findOne({
                where: { id },
            });

            if (!user) {
                throw new Error("user not found");
            }

            await User.delete({ id });
        } catch (error: unknown) {
            const message = "Erreur lors de la suppression de l'utilisateur";
            logError(error, message);
            throw new Error(message);
        }

        return true;
    }

    @Mutation(() => Boolean)
    async changePassword(
        @Arg("id") id: string,
        @Arg("password") password: string
    ): Promise<Boolean> {
        let user: User | null;
        try {
            user = await User.findOne({
                where: { id },
            });

            if (!user) {
                throw new Error("user not found");
            }

            // argon2
            user.password = await argon2.hash(password);

            await user.save();
        } catch (error: unknown) {
            const message = "Erreur lors de la suppression de l'utilisateur";
            logError(error, message);
            throw new Error(message);
        }

        return true;
    }

    @Mutation(() => User)
    async updateUser(
        @Arg("id") id: string,
        @Arg("email", { nullable: true }) email?: string,
        @Arg("firstName", { nullable: true }) firstName?: string,
        @Arg("lastName", { nullable: true }) lastName?: string,
        @Arg("address", { nullable: true }) address?: string,
        @Arg("zipCode", { nullable: true }) zipCode?: string,
        @Arg("city", { nullable: true }) city?: string,
        @Arg("biography", { nullable: true }) biography?: string,
        @Arg("gender", { nullable: true }) gender?: string,
        @Arg("dateOfBirth", { nullable: true }) dateOfBirth?: Date,
        @Arg("picture", { nullable: true }) picture?: string
    ): Promise<User> {
        try {
            const user: User | null = await User.findOne({
                where: { id },
            });

            if (!user) {
                throw new Error("user not found");
            }

            if (email) {
                const isEmailUsed: User | null = await User.findOne({
                    where: { email },
                });
                if (isEmailUsed) {
                    throw new Error("email is already in use");
                }
                user.email = email;
            }
            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (address) user.address = address;
            if (zipCode) user.zipCode = zipCode;
            if (city) user.city = city;
            if (biography) user.biography = biography;
            if (gender) user.gender = gender;
            if (dateOfBirth) user.dateOfBirth = dateOfBirth;
            if (picture) user.picture = picture;

            await user.save();

            return user;
        } catch (error: unknown) {
            const message =
                "Erreur lors de la mise à jour des données de l'utilisateur";
            logError(error, message);
            throw new Error(message);
        }
    }

    @Mutation(() => Number)
    async transferMango(
        @Arg("id") id: string,
        @Arg("amount") amount: number
    ): Promise<Number> {
        try {
            const user: User | null = await User.findOne({
                where: { id },
            });

            if (!user) {
                throw new Error("user not found");
            }

            user.mangoBalance += amount;

            await user.save();

            return user.mangoBalance;
        } catch (error: unknown) {
            const message = "Erreur lors de la suppression de l'utilisateur";
            logError(error, message);
            throw new Error(message);
        }
    }
}

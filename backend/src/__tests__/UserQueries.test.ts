import * as argon2 from "argon2";
import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import { mockTypeOrm } from "../tests_mockTypeorm-config";

import { User } from "../entities/User";
import { UserQueries } from "../resolvers/UserQueries";

describe("userQueries", () => {
    let mockUsers: User[];
    let userQueries: UserQueries;

    const createMockUsers = (count: number): User[] => {
        return Array.from(
            { length: count },
            () =>
                new User(
                    faker.person.firstName(),
                    faker.person.lastName(),
                    faker.internet.email(),
                    faker.internet.password(),
                    faker.image.avatar(),
                    faker.location.streetAddress(),
                    faker.location.zipCode(),
                    faker.location.city()
                )
        );
    };

    beforeAll(() => {
        userQueries = new UserQueries();
    });

    beforeEach(async () => {
        const hashedPassword: string = await argon2.hash("password");
        mockUsers = [
            new User(
                "John",
                "Doe",
                "john.doe@gmail.com",
                hashedPassword,
                "picture",
                "adress",
                "75000",
                "paris"
            ),
            ...createMockUsers(4),
        ];
    });

    describe("login", () => {
        it("should return 'Identifiants incorrects' error due to a bad email", async () => {
            mockTypeOrm().onMock(User).toReturn(null, "findOne");
            await expect(
                userQueries.login("john.dur@gmail.com", "goodPassword")
            ).rejects.toThrow("Identifiants incorrects");
        });

        it("should return 'Identifiants incorrects' error due to a bad password", async () => {
            mockTypeOrm().onMock(User).toReturn(null, "findOne");
            await expect(
                userQueries.login("john.doe@gmail.com", "badPassword")
            ).rejects.toThrow("Identifiants incorrects");
        });

        it("should return a valid JWT token", async () => {
            mockTypeOrm().onMock(User).toReturn(mockUsers[0], "findOne");

            const token: string = (
                await userQueries.login("john.doe@gmail.com", "password")
            ).token;

            const jwtSecret: string = process.env.JWT_SECRET || "itsasecret";
            const decodedToken: jwt.JwtPayload = jwt.verify(
                token,
                jwtSecret
            ) as jwt.JwtPayload;

            expect(decodedToken).toHaveProperty("email", "john.doe@gmail.com");
        });
    });

    describe("getUserByEmail", () => {
        it("should return 'L'utilisateur n'existe pas' error", async () => {
            mockTypeOrm().onMock(User).toReturn(null, "findOne");
            await expect(
                userQueries.getUserByEmail("john.dur@gmail.com")
            ).rejects.toThrow("L'utilisateur n'existe pas");
        });

        it("should return an user", async () => {
            mockTypeOrm().onMock(User).toReturn(mockUsers[0], "findOne");
            const user: User = await userQueries.getUserByEmail(
                "john.doe@gmail.com"
            );
            expect(user).toBeInstanceOf(User);
        });
    });

    describe("getMangoBalanceByUserId", () => {
        it("should return 'L'utilisateur n'existe pas' error", async () => {
            mockTypeOrm().onMock(User).toReturn(null, "findOne");
            await expect(
                userQueries.getMangoBalanceByUserId("badId")
            ).rejects.toThrow("L'utilisateur n'existe pas");
        });

        it("should return user mango balance's", async () => {
            mockTypeOrm().onMock(User).toReturn(mockUsers[0], "findOne");
            const mangoBalance: number =
                await userQueries.getMangoBalanceByUserId("goodId");
            expect(mangoBalance).toEqual(mockUsers[0].mangoBalance);
        });
    });

    describe("credentialsVerification", () => {
        it("should return 'L'adresse mail est déjà utilisée' error", async () => {
            mockTypeOrm().onMock(User).toReturn(true, "findOne");
            await expect(
                userQueries.credentialsVerification(
                    "john.doe@gmail.com",
                    "P@ssword123",
                    "P@ssword123"
                )
            ).rejects.toThrow("L'adresse mail est déjà utilisée");
        });

        it("should return 'Les mots de passe doivent être identiques", async () => {
            mockTypeOrm().onMock(User).toReturn(null, "findOne");
            await expect(
                userQueries.credentialsVerification(
                    "never-used@gmail.com",
                    "P@ssword123",
                    "P@ssword321"
                )
            ).rejects.toThrow("Les mots de passe doivent être identiques");
        });

        it("should return true", async () => {
            mockTypeOrm().onMock(User).toReturn(null, "findOne");
            const isCorrectCredentials: Boolean =
                await userQueries.credentialsVerification(
                    "never-used@gmail.com",
                    "P@ssword123",
                    "P@ssword123"
                );

            expect(isCorrectCredentials).toBeTruthy();
        });
    });
});

import * as argon2 from "argon2";
import { faker } from "@faker-js/faker";
import { mockTypeOrm } from "../tests_mockTypeorm-config";

import { User } from "../entities/User";
import { UserMutations } from "../resolvers/UserMutations";

describe("userMutations", () => {
    let mockUsers: User[];
    let userMutations: UserMutations;

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
        userMutations = new UserMutations();
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

    describe("register", () => {
        it("should return an 'email is already in use' error", async () => {
            mockTypeOrm().onMock(User).toReturn(mockUsers[0], "findOne");
            await expect(
                userMutations.register(
                    "john.doe@gmail.com",
                    "password",
                    "john",
                    "doe",
                    "address",
                    "75000",
                    "paris",
                    []
                )
            ).rejects.toThrow("email is already in use");
        });

        it("should return an user", async () => {
            mockTypeOrm()
                .onMock(User)
                .toReturn(null, "findOne")
                .toReturn(mockUsers[0], "create")
                .toReturn(mockUsers[0], "save");
            const user: User = await userMutations.register(
                "john.dur@gmail.com",
                "password",
                "john",
                "dur",
                "address",
                "75000",
                "paris",
                []
            );
            expect(user).toBeInstanceOf(User);
        });
    });

    describe("deleteAccount", () => {
        it("should return an 'user not found' error", async () => {
            mockTypeOrm().onMock(User).toReturn(null, "findOne");
            await expect(userMutations.deleteAccount("badId")).rejects.toThrow(
                "user not found"
            );
        });

        it("should return true", async () => {
            mockTypeOrm()
                .onMock(User)
                .toReturn(mockUsers[0], "findOne")
                .toReturn(true, "delete");
            const isDeleted: Boolean = await userMutations.deleteAccount(
                "goodId"
            );
            expect(isDeleted).toBeTruthy();
        });
    });

    describe("changePassword", () => {
        it("should return an 'user not found' error", async () => {
            mockTypeOrm().onMock(User).toReturn(null, "findOne");
            await expect(
                userMutations.changePassword("badId", "password")
            ).rejects.toThrow("user not found");
        });

        it("should return true", async () => {
            mockTypeOrm()
                .onMock(User)
                .toReturn(mockUsers[0], "findOne")
                .toReturn(mockUsers[0], "save");
            const passwordIsChanged: Boolean =
                await userMutations.changePassword("goodId", "password");
            expect(passwordIsChanged).toBeTruthy();
        });
    });

    describe("updateUser", () => {
        it("should return an 'user not found' error", async () => {
            mockTypeOrm().onMock(User).toReturn(null, "findOne");
            await expect(
                userMutations.updateUser(
                    "badId",
                    "john.dur@gmail.com",
                    "password",
                    "john",
                    "dur",
                    "address",
                    "75000",
                    "paris"
                )
            ).rejects.toThrow("user not found");
        });

        it("should return an 'email is already un use' error", async () => {
            mockTypeOrm().onMock(User).toReturn(mockUsers[0], "findOne");
            await expect(
                userMutations.updateUser(
                    "goodId",
                    "john.doe@gmail.com",
                    "password",
                    "john",
                    "doe",
                    "address",
                    "75000",
                    "paris"
                )
            ).rejects.toThrow("email is already in use");
        });

        it("should return a user", async () => {
            mockTypeOrm()
                .onMock(User)
                .toReturn(mockUsers[0], "findOne")
                .toReturn(false, "findOne")
                .toReturn(
                    new User(
                        "goodId",
                        "john.dur@gmail.com",
                        "password",
                        "john",
                        "dur",
                        "address",
                        "75000",
                        "paris"
                    ),
                    "save"
                );
            const user: User = await userMutations.updateUser(
                "goodId",
                "john.dur@gmail.com",
                "password",
                "john",
                "dur",
                "address",
                "75000",
                "paris"
            );
            expect(user).toBeInstanceOf(User);
        });
    });

    describe("transferMango", () => {
        it("shoud return an 'user not found' error", async () => {
            mockTypeOrm().onMock(User).toReturn(null, "findOne");
            await expect(
                userMutations.transferMango("badId", 5)
            ).rejects.toThrow("user not found");
        });

        it("shoud return user mango balance's", async () => {
            mockTypeOrm()
                .onMock(User)
                .toReturn(mockUsers[0], "findOne")
                .toReturn(mockUsers[0], "save");
            const mangoBalance: number = await userMutations.transferMango(
                "goodId",
                5
            );
            expect(mangoBalance).toEqual(mockUsers[0].mangoBalance);
        });
    });
});

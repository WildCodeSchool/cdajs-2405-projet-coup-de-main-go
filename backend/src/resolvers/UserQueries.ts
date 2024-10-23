import { Resolver, Query, Arg } from "type-graphql";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { dataSource } from "../datasource";

@Resolver(User)
export class UserQueries {
  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    return await dataSource.manager.find(User, { relations: ["skills"] });
  }

  @Query(() => String)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<string> {
    const user: User | null = await dataSource.manager.findOne(User, {
      where: { email },
    });

    if (!user) {
      throw new Error("incorrect identifiers");
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
    const user: User | null = await dataSource.manager.findOne(User, {
      relations: ["skills"],
      where: { email },
    });

    if (!user) {
      throw new Error("user not found");
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
      throw new Error("user not found");
    }

    return user.mangoBalance;
  }
}

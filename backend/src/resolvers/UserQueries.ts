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
import passwordVerification from "../utils/passwordVerification";

@ObjectType()
class LoginResponse {
  @Field()
  token!: string;

  @Field()
  userId!: string;
}

@ObjectType()
class UserOverview {
  @Field()
  user!: User;

  @Field()
  reviewsAsHelperCount!: number;

  @Field({ nullable: true })
  averageRating?: number;
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

    const token: string = jwt.sign({ email, id: user.id }, jwtSecret, {
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

    passwordVerification(password);

    return true;
  }

  @Query(() => UserOverview)
  async getUserOverviewById(@Arg("id") id: string): Promise<UserOverview> {
    const user = await dataSource.manager.findOne(User, {
      where: { id },
      relations: ["reviewsAsHelper"],
    });

    if (!user) {
      throw new Error("L'utilisateur n'existe pas");
    }

    const reviewsAsHelper = (await user.reviewsAsHelper) || [];

    const reviewsAsHelperCount = reviewsAsHelper.length;

    const averageRating =
      reviewsAsHelperCount > 0
        ? (
            reviewsAsHelper.reduce((acc, review) => acc + review.rating, 0) /
            reviewsAsHelperCount
          ).toFixed(1)
        : null;

    return {
      user: user,
      reviewsAsHelperCount,
      averageRating: averageRating ? parseFloat(averageRating) : undefined,
    };
  }

    @Query(() => User)
async getUserById(@Arg("id") id: string): Promise<User> {
    const user: User | null = await dataSource.manager.findOne(User, {
        relations: ["skills"],
        where: { id },
    });

    if (!user) {
        throw new Error("L'utilisateur n'existe pas");
    }

    return user;
}

}

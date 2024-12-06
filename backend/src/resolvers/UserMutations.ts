import { Resolver, Mutation, Arg } from "type-graphql";
import * as argon2 from "argon2";

import { dataSource } from "../datasource";
import { Skill } from "../entities/Skill";
import { User } from "../entities/User";
import uploadFile from "../utils/uploadFile";

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
    @Arg("city") city: string,
    @Arg("skillsId", () => [String]) skillsId: string[]
  ): Promise<User> {
    const isEmailUsed: User | null = await dataSource.manager.findOne(User, {
      where: { email },
    });

    if (isEmailUsed) {
      throw new Error("email is already in use");
    }

    // argon2
    const passwordHashed: string = await argon2.hash(password);

    // Charger les skills en fonction de leur id
    const skills = (
      await Promise.all(
        skillsId.map(async (skillId) => {
          return await dataSource.manager.findOne(Skill, {
            where: { id: skillId },
          });
        })
      )
    ).filter((skill): skill is Skill => skill !== null); // Filtrer les null

    let user: User;
    try {
      user = dataSource.manager.create(User, {
        email,
        password: passwordHashed,
        firstName,
        lastName,
        address,
        zipCode,
        city,
        skills,
      });

      await dataSource.manager.save(user);
    } catch (error) {
      console.error(error);
      throw new Error("Erreur lors de l'inscription");
    }

    return user;
  }

  @Mutation(() => Boolean)
  async deleteAccount(@Arg("id") id: string): Promise<Boolean> {
    const user: User | null = await dataSource.manager.findOne(User, {
      where: { id },
    });

    if (!user) {
      throw new Error("user not found");
    }

    try {
      await dataSource.manager.delete(User, { id });
    } catch (error: unknown) {
      console.error(error);
      throw new Error("Erreur lors de la suppression de l'utilisateur");
    }

    return true;
  }

  @Mutation(() => Boolean)
  async changePassword(
    @Arg("id") id: string,
    @Arg("password") password: string
  ): Promise<Boolean> {
    let user: User | null;
    user = await dataSource.manager.findOne(User, {
      where: { id },
    });

    if (!user) {
      throw new Error("user not found");
    }

    // argon2
    user.password = await argon2.hash(password);

    try {
      await dataSource.manager.save(user);
    } catch (error: unknown) {
      console.error(error);
      throw new Error("Erreur lors de la suppression de l'utilisateur");
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
    const user: User | null = await dataSource.manager.findOne(User, {
      where: { id },
    });

    if (!user) {
      throw new Error("user not found");
    }

    if (email) {
      const isEmailUsed: User | null = await dataSource.manager.findOne(User, {
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

    try {
      await dataSource.manager.save(user);
    } catch (error: unknown) {
      console.error(error);
      throw new Error(
        "Erreur lors de la mise à jour des données de l'utilisateur"
      );
    }

    return user;
  }

  @Mutation(() => Number)
  async transferMango(
    @Arg("id") id: string,
    @Arg("amount") amount: number
  ): Promise<number> {
    const user: User | null = await dataSource.manager.findOne(User, {
      where: { id },
    });

    if (!user) {
      throw new Error("user not found");
    }

    user.mangoBalance += amount;

    try {
      await dataSource.manager.save(user);
    } catch (error: unknown) {
      console.error(error);
      throw new Error("Erreur lors de la suppression de l'utilisateur");
    }

    return user.mangoBalance;
  }

  @Mutation(() => User)
  async updateProfilePicture(
    @Arg("id") id: string,
    @Arg("picture") picture: string
  ): Promise<User> {
    const user: User | null = await dataSource.manager.findOne(User, {
      where: { id },
    });
    if (!user) {
      throw new Error("User not found");
    }

    if (!picture) {
      throw new Error("No file path provided");
    }

    try {
      const savedFileName = uploadFile({
        base64String: picture,
        targetType: "user",
        id,
        oldFileName: user.picture, 
      });
  
      user.picture = savedFileName;
      await dataSource.manager.save(user);
  
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Erreur lors de l'upload : ${error.message}`
        );
      }
      throw new Error("Une erreur inconnue est survenue.");
    }
  }
}

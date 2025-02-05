import * as argon2 from "argon2";
import { validateOrReject } from "class-validator";
import { Resolver, Mutation, Arg } from "type-graphql";
import { In } from "typeorm";

import { dataSource } from "../datasource";
import { Skill } from "../entities/Skill";
import { User } from "../entities/User";
import passwordVerification from "../utils/passwordVerification";
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
      throw new Error("L'adresse mail est déjà utilisée");
    }

    passwordVerification(password);

    // argon2
    const passwordHashed: string = await argon2.hash(password);

    // Charger les skills en fonction de leur id
    const skills = await dataSource.manager.find(Skill, {
      where: { id: In(skillsId) },
    });

    let user: User;
    try {
      // Créer l'utilisateur
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

      // Valider l'entité avant de la sauvegarder
      await validateOrReject(user).catch((errors) => {
        // Si la validation échoue, afficher les erreurs
        console.log("Erreurs de validation:", errors);
        throw new Error("Validation échouée");
      });

      // Sauvegarder l'utilisateur dans la base de données
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
      throw new Error("L'utilisateur n'existe pas");
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
      throw new Error("L'utilisateur n'existe pas");
    }

    passwordVerification(password);

    // argon2
    user.password = await argon2.hash(password);

    try {
      // Valider l'entité avant de la sauvegarder
      await validateOrReject(user).catch((errors) => {
        // Si la validation échoue, afficher les erreurs
        console.log("Erreurs de validation:", errors);
        throw new Error("Validation échouée");
      });

      // Sauvegarder l'utilisateur dans la base de données
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
    @Arg("picture", { nullable: true }) picture?: string,
    @Arg("skillsId", () => [String], { nullable: true }) skillsId?: string[]
  ): Promise<User> {
    const user: User | null = await dataSource.manager.findOne(User, {
      where: { id },
    });

    if (!user) {
      throw new Error("L'utilisateur n'existe pas");
    }

    if (email) {
      const isEmailUsed: User | null = await dataSource.manager.findOne(User, {
        where: { email },
      });
      if (isEmailUsed) {
        throw new Error("L'adresse mail est déjà utilisée");
      }
      user.email = email;
    }
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (address) user.address = address;
    if (zipCode) user.zipCode = zipCode;
    if (city) user.city = city;
    if (skillsId && skillsId.length > 0) {
      // Charger les skills en fonction de leur id
      const skills = await dataSource.manager.find(Skill, {
        where: { id: In(skillsId) },
      });
      user.skills = skills;
    }

    if (biography) user.biography = biography;
    if (gender) user.gender = gender;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (picture) user.picture = picture;

    try {
      // Valider l'entité avant de la sauvegarder
      await validateOrReject(user).catch((errors) => {
        // Si la validation échoue, afficher les erreurs
        console.log("Erreurs de validation:", errors);
        throw new Error("Validation échouée");
      });

      // Sauvegarder l'utilisateur dans la base de données
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
      throw new Error("L'utilisateur n'existe pas");
    }

    user.mangoBalance += amount;

    try {
      // Valider l'entité avant de la sauvegarder
      await validateOrReject(user).catch((errors) => {
        // Si la validation échoue, afficher les erreurs
        console.log("Erreurs de validation:", errors);
        throw new Error("Validation échouée");
      });

      // Sauvegarder l'utilisateur dans la base de données
      await dataSource.manager.save(user);
    } catch (error: unknown) {
      console.error(error);
      throw new Error("Erreur lors de la suppression de l'utilisateur");
    }

    return user.mangoBalance;
  }

  @Mutation(() => Boolean)
  async transferBetweenUsers(
    @Arg("fromId") fromId: string,
    @Arg("toId") toId: string,
    @Arg("amount") amount: number
  ): Promise<boolean> {
    const fromUser = await dataSource.manager.findOne(User, {
      where: { id: fromId },
    });
    const toUser = await dataSource.manager.findOne(User, {
      where: { id: toId },
    });

    if (!fromUser || !toUser) {
      throw new Error("L'un des utilisateurs n'existe pas");
    }

    if (fromUser.mangoBalance < amount) {
      throw new Error("Solde insuffisant");
    }

    fromUser.mangoBalance -= amount;
    toUser.mangoBalance += amount;

    try {
      await dataSource.manager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.save(fromUser);
          await transactionalEntityManager.save(toUser);
        }
      );

      return true;
    } catch (error) {
      console.error("Erreur lors de la transaction :", error);
      throw new Error("Échec de la transaction");
    }
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
        throw new Error(`Erreur lors de l'upload : ${error.message}`);
      }
      throw new Error("Une erreur inconnue est survenue.");
    }
  }

  @Mutation(() => Boolean)
  async creditWeeklyMango(): Promise<boolean> {
    const users: User[] = await dataSource.manager.find(User);

    if (users.length === 0) {
      throw new Error("Aucun utilisateur trouvé");
    }

    for (const user of users) {
      user.mangoBalance += 1;

      try {
        await dataSource.manager.save(user);
      } catch (error) {
        console.error(`Erreur lors de la mise à jour de l'utilisateur ${user.id}:`, error);
        continue;
      }
    }

    return true;
  }
}

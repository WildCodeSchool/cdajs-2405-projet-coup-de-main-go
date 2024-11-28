import { Mutation, Resolver, Arg, InputType, Field, Int } from "type-graphql";
import { Length, IsInt, IsOptional } from "class-validator";
import { Ad, Status } from "../entities/Ad";
import { User } from "../entities/User";
import { Skill } from "../entities/Skill";
import { dataSource } from "../datasource";
import { Transaction } from "../entities/Transaction";

@InputType()
export class AdInput {
  @Field()
  @Length(1, 50, {
    message: "Le titre doit contenir entre 1 et 50 caractères.",
  })
  title!: string;

  @Field()
  @Length(1, 255, {
    message: "La description doit contenir entre 1 et 255 caractères.",
  })
  description!: string;

  @Field()
  @Length(1, 255, {
    message: "L'adresse doit contenir entre 1 et 255 caractères.",
  })
  address!: string;

  @Field()
  @Length(5, 5, {
    message: "Le code postal doit contenir 5 caractères.",
  })
  zipCode!: string;

  @Field()
  @Length(1, 100, {
    message: "La ville doit contenir entre 1 et 100 caractères.",
  })
  city!: string;

  @Field(() => Int)
  @IsInt()
  duration!: number;

  @Field(() => Int)
  @IsInt()
  mangoAmount!: number;

  @Field({ nullable: true })
  @IsOptional()
  picture1?: string;

  @Field({ nullable: true })
  @IsOptional()
  picture2?: string;

  @Field({ nullable: true })
  @IsOptional()
  picture3?: string;

  @Field()
  userRequesterId!: string;

  @Field()
  skillId!: string;
}

@Resolver(Ad)
export class AdMutations {
  // Mutation to create a new Ad
  @Mutation(() => Ad)
  async createAd(@Arg("adData") adData: AdInput): Promise<Ad> {
    // Check if userRequested exists
    const userRequester = await dataSource.manager.findOneBy(User, {
      id: adData.userRequesterId,
    });
    if (!userRequester) {
      throw new Error("User not found");
    }

    // Check if selected skill exists
    const skill = await dataSource.manager.findOneBy(Skill, {
      id: adData.skillId,
    });
    if (!skill) {
      throw Error("Skill not found");
    }

    try {
      // Create and save Ad
      const ad = dataSource.manager.create(Ad, {
        ...adData,
        userRequester,
        skill,
      });

      await ad.save();
      return ad;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create Ad");
    }
  }

  // Mutation to update an existing Ad
  @Mutation(() => Ad)
  async updateAd(
    @Arg("id") id: string,
    @Arg("adData") adData: AdInput
  ): Promise<Ad> {
    // Find the existing Ad
    const ad = await dataSource.manager.findOneBy(Ad, { id });
    if (!ad) {
      throw new Error("Ad not found");
    }

    // Check if userRequester exists
    const userRequester = await dataSource.manager.findOneBy(User, {
      id: adData.userRequesterId,
    });
    if (!userRequester) {
      throw new Error("User not found");
    }

    // Ckeck if selected skill exists
    const skill = await dataSource.manager.findOneBy(Skill, {
      id: adData.skillId,
    });
    if (!skill) {
      throw new Error("Skill not found");
    }

    try {
      // Update Ad with new data
      Object.assign(ad, { ...adData, userRequester, skill });

      await ad.save();
      return ad;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update Ad");
    }
  }

  // Mutation to delete Ad (possible only when no transaction is associated to this specific Ad)
  @Mutation((_) => Boolean)
  async deleteAd(@Arg("id") id: string): Promise<boolean> {
    return await dataSource.transaction(async (transactionalEntityManager) => {
      // Find ad to delete
      const ad = await transactionalEntityManager.findOne(Ad, {
        where: { id },
      });

      if (!ad) {
        throw new Error("Ad not found");
      }

      const associatedTransaction = await transactionalEntityManager.findOne(
        Transaction,
        {
          where: { ad: { id: ad.id } },
        }
      );

      if (associatedTransaction) {
        throw new Error("Ad is associated to a transaction");
      }

      try {
        // Update chats associated with the ad, to set adId as null
        if (ad.chats) {
          const chats = await ad.chats;
          for (const chat of chats) {
            chat.ad = null as any;
            await transactionalEntityManager.save(chat);
          }
        }
        // Delete Ad
        await transactionalEntityManager.remove(ad);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    });
  }

  @Mutation(() => Ad)
  async updateAdStatus(
    @Arg("id") id: string,
    @Arg("status") status: Status
  ): Promise<Ad> {
    const ad = await dataSource.manager.findOneBy(Ad, { id });
    if (!ad) {
      throw new Error("Annonce introuvable");
    }

    ad.status = status;
    try {
      await ad.save();
      return ad;
    } catch (error) {
      throw new Error("Échec de la mise à jour de l'annonce");
    }
  }
}

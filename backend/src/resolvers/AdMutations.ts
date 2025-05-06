import { Mutation, Resolver, Arg, InputType, Field, Int } from "type-graphql";
import { Length, IsInt, IsOptional } from "class-validator";
import { Ad, Status } from "../entities/Ad";
import { User } from "../entities/User";
import { Skill } from "../entities/Skill";
import { dataSource } from "../datasource";
import uploadFile from "../utils/uploadFile";
import deleteFile from "../utils/deleteFile";

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

  @Field({ nullable: true })
  @IsOptional()
  latitude?: number;

  @Field({ nullable: true })
  @IsOptional()
  longitude?: number;

  @Field(() => Int)
  @IsInt()
  duration!: number;

  @Field(() => Int)
  @IsInt()
  mangoAmount!: number;

  @Field()
  userRequesterId!: string;

  @Field()
  skillId!: string;

  @Field({ nullable: true })
  @IsOptional()
  picture1?: string;

  @Field({ nullable: true })
  @IsOptional()
  picture2?: string;

  @Field({ nullable: true })
  @IsOptional()
  picture3?: string;
}

@InputType()
export class AdUpdateInput {
  @Field({ nullable: true })
  @IsOptional()
  @Length(1, 50, {
    message: "Le titre doit contenir entre 1 et 50 caractères.",
  })
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(1, 255, {
    message: "La description doit contenir entre 1 et 255 caractères.",
  })
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(1, 255, {
    message: "L'adresse doit contenir entre 1 et 255 caractères.",
  })
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(5, 5, {
    message: "Le code postal doit contenir 5 caractères.",
  })
  zipCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(1, 100, {
    message: "La ville doit contenir entre 1 et 100 caractères.",
  })
  city?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  duration?: number;

  @Field({ nullable: true })
  @IsOptional()
  latitude?: number;

  @Field({ nullable: true })
  @IsOptional()
  longitude?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  mangoAmount?: number;

  @Field({ nullable: true })
  @IsOptional()
  userRequesterId?: string;

  @Field({ nullable: true })
  @IsOptional()
  skillId?: string;

  @Field({ nullable: true })
  @IsOptional()
  picture1?: string;

  @Field({ nullable: true })
  @IsOptional()
  picture2?: string;

  @Field({ nullable: true })
  @IsOptional()
  picture3?: string;
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

      if (adData.picture1) {
        try {
          const uploadResponse = uploadFile({
            base64String: adData.picture1,
            targetType: "ad",
            id: ad.id?.toString()!,
          });
          ad.picture1 = uploadResponse;
        } catch (error) {
          throw new Error(
            `Échec de l'upload pour les fichiers: ${
              (error as Error).message || error
            }`
          );
        }
      }

      if (adData.picture2) {
        try {
          const uploadResponse = uploadFile({
            base64String: adData.picture2,
            targetType: "ad",
            id: ad.id?.toString()!,
          });
          ad.picture2 = uploadResponse;
        } catch (error) {
          throw new Error(
            `Échec de l'upload pour les fichiers: ${
              (error as Error).message || error
            }`
          );
        }
      }

      if (adData.picture3) {
        try {
          const uploadResponse = uploadFile({
            base64String: adData.picture3,
            targetType: "ad",
            id: ad.id?.toString()!,
          });
          ad.picture3 = uploadResponse;
        } catch (error) {
          throw new Error(
            `Échec de l'upload pour les fichiers: ${
              (error as Error).message || error
            }`
          );
        }
      }

      await ad.save();

      return ad;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erreur lors de l'upload : ${error.message}`);
      }
      throw new Error("Une erreur inconnue est survenue.");
    }
  }

  // Mutation to update an existing Ad
  @Mutation(() => Ad)
  async updateAd(
    @Arg("id") id: string,
    @Arg("adData", { nullable: true }) adData?: AdUpdateInput
  ): Promise<Ad> {
    // Find the existing Ad
    const ad = await dataSource.manager.findOneBy(Ad, { id });
    if (!ad) {
      throw new Error("Ad not found");
    }

    try {
      if (adData) {
        if (adData.userRequesterId) {
          // Check if userRequester exists
          const userRequester = await dataSource.manager.findOneBy(User, {
            id: adData.userRequesterId,
          });
          if (!userRequester) {
            throw new Error("User not found");
          }
          ad.userRequester = userRequester;
        }

        if (adData.skillId) {
          // Ckeck if selected skill exists
          const skill = await dataSource.manager.findOneBy(Skill, {
            id: adData.skillId,
          });
          if (!skill) {
            throw new Error("Skill not found");
          }
          ad.skill = skill;
        }

        const { picture1, picture2, picture3, ...rest } = adData;
        if (adData.picture1 && adData.picture1 != ad.picture1) {
          if (adData.picture1 === "" && ad.picture1) {
            // Delete existing file
            deleteFile(ad.picture1, "ad", ad.id?.toString()!);
            ad.picture1 = "";
          } else {
            // Replace existing file or add a new one
            try {
              const uploadResponse = uploadFile({
                base64String: adData.picture1,
                targetType: "ad",
                id: ad.id?.toString()!,
                oldFileName: ad.picture1,
              });
              ad.picture1 = uploadResponse || "";
            } catch (error) {
              throw new Error(
                `Échec de l'upload pour les fichiers: ${
                  (error as Error).message || error
                }`
              );
            }
          }
        }

        if (adData.picture2 && adData.picture2 != ad.picture2) {
          if (adData.picture2 === "" && ad.picture2) {
            // Delete existing file
            deleteFile(ad.picture2, "ad", ad.id?.toString()!);
            ad.picture2 = "";
          } else {
            // Replace existing file or add a new one
            try {
              const uploadResponse = uploadFile({
                base64String: adData.picture2,
                targetType: "ad",
                id: ad.id?.toString()!,
                oldFileName: ad.picture2,
              });
              ad.picture2 = uploadResponse;
            } catch (error) {
              throw new Error(
                `Échec de l'upload pour les fichiers: ${
                  (error as Error).message || error
                }`
              );
            }
          }
        }

        if (adData.picture3 && adData.picture3 != ad.picture3) {
          if (adData.picture3 === "" && ad.picture3) {
            // Delete existing file
            deleteFile(ad.picture3, "ad", ad.id?.toString()!);
            ad.picture3 = "";
          } else {
            // Replace existing file or add a new one
            try {
              const uploadResponse = uploadFile({
                base64String: adData.picture3,
                targetType: "ad",
                id: ad.id?.toString()!,
                oldFileName: ad.picture3,
              });
              ad.picture3 = uploadResponse;
            } catch (error) {
              throw new Error(
                `Échec de l'upload pour les fichiers: ${
                  (error as Error).message || error
                }`
              );
            }
          }
        }

        // Update Ad with new data
        Object.assign(ad, rest);
      }

      await ad.save();
      return ad;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erreur lors de l'upload : ${error.message}`);
      }
      throw new Error("Une erreur inconnue est survenue.");
    }
  }

  // Mutation to delete Ad
  @Mutation((_) => Boolean)
  async deleteAd(
    @Arg("id") id: string,
    @Arg("userRequesterId") userRequesterId: string
  ): Promise<boolean> {
    return await dataSource.transaction(async (transactionalEntityManager) => {
      // Retrieve ad
      const ad = await transactionalEntityManager.findOne(Ad, {
        where: { id },
      });

      if (!ad) {
        throw new Error("Ad not found");
      }

      // Check that the user requesting deletion is the ad owner
      if (userRequesterId && ad.userRequester?.id != userRequesterId) {
        throw new Error("User not allowed to delete the ad");
      }

      // Prevent deletion if ad is finalised or reviewed
      if (ad.status === "finalised" || ad.status === "isreviewed") {
        throw new Error(
          "Ad cannot be deleted as the service has already been provided"
        );
      }

      try {
        // Nullify ad reference in chats
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
        throw new Error("Erreur lors de la suppression de l'annonce");
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

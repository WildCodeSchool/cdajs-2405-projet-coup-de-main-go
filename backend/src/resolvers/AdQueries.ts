import { Query, Resolver, Arg, Int, Float } from "type-graphql";
import { Ad } from "../entities/Ad";
import { dataSource } from "../datasource";

@Resolver(Ad)
export class AdQueries {
  @Query(() => [Ad])
  async getAllAds(
    @Arg("skillId", () => String, { nullable: true }) skillId?: string,
    @Arg("mangoAmountMin", () => Int, { nullable: true })
    mangoAmountMin?: number,
    @Arg("mangoAmountMax", () => Int, { nullable: true })
    mangoAmountMax?: number,
    @Arg("page", () => Int, { defaultValue: 1 }) page: number = 1,
    @Arg("limit", () => Int, { defaultValue: 15 }) limit: number = 15
  ): Promise<Ad[]> {
    const query = dataSource.getRepository(Ad).createQueryBuilder("ad");
    const offset = (page - 1) * limit;

    // Join with Skill and User entities
    query
      .leftJoinAndSelect("ad.skill", "skill")
      .leftJoinAndSelect("ad.userRequester", "userRequester");

    // Apply filters if provided
    if (skillId) {
      query.andWhere("ad.skillId = :skillId", { skillId });
    }

    if (mangoAmountMin !== undefined) {
      query.andWhere("ad.mangoAmount >= :mangoAmountMin", { mangoAmountMin });
    }

    if (mangoAmountMax !== undefined) {
      query.andWhere("ad.mangoAmount <= :mangoAmountMax", { mangoAmountMax });
    }

    // Apply pagination
    query.skip(offset).take(limit);

    // Execute request and return results
    return await query.getMany();
  }

  @Query(() => Ad)
  async getAdById(@Arg("id") id: string): Promise<Ad | null> {
    const ad: Ad | null = await dataSource.manager.findOne(Ad, {
      where: { id },
    });

    if (!ad) {
      throw new Error(`Annonce non trouvée pour l'id ${id}`);
    }

    return ad;
  }

  @Query(() => [Ad])
  async getAdsByUser(@Arg("userId") userId: string): Promise<Ad[]> {
    const ads: Ad[] = await dataSource.manager.findBy(Ad, {
      userRequester: { id: userId },
    });

    if (!ads) {
      throw new Error(`Aucune annonce trouvée pour l'utilisateur ${userId}`);
    }

    return ads;
  }
}

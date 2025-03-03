import { Query, Resolver, Arg, Int, Float } from "type-graphql";
import { Ad, Status } from "../entities/Ad";
import { dataSource } from "../datasource";
import calculateDistance from "../utils/calculateDistance";

@Resolver(Ad)
export class AdQueries {
  @Query(() => [Ad])
  async getAllAds(
    @Arg("skillId", () => String, { nullable: true }) skillId?: string,
    @Arg("mangoAmountMin", () => Int, { nullable: true })
    mangoAmountMin?: number,
    @Arg("mangoAmountMax", () => Int, { nullable: true })
    mangoAmountMax?: number,
    @Arg("durationMin", () => Int, { nullable: true })
    durationMin?: number,
    @Arg("durationMax", () => Int, { nullable: true })
    durationMax?: number,
    @Arg("status", () => Status, { nullable: true }) status?: Status,
    @Arg("maxDistance", () => Float, { nullable: true })
    maxDistance?: number,
    @Arg("userLatitude", () => Float, { nullable: true })
    userLatitude?: number,
    @Arg("userLongitude", () => Float, { nullable: true })
    userLongitude?: number,
    @Arg("page", () => Int, { defaultValue: 1 }) page: number = 1,
    @Arg("limit", () => Int, { defaultValue: 15 }) limit: number = 15,
    @Arg("orderBy", () => String, { defaultValue: "DESC" })
    orderBy: "ASC" | "DESC" = "DESC"
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

    if (durationMin !== undefined) {
      query.andWhere("ad.duration >= :durationMin", { durationMin });
    }

    if (durationMax !== undefined) {
      query.andWhere("ad.duration <= :durationMax", { durationMax });
    }

    if (status) {
      query.andWhere("ad.status = :status", { status });
    }

    // Apply distance filter if maxDistance and user coordinates are provided
    if (
      maxDistance !== undefined &&
      userLatitude !== undefined &&
      userLongitude !== undefined
    ) {
      const ads = await query.getMany();
      const filteredAds = ads.filter((ad) => {
        if (ad.latitude !== undefined && ad.longitude !== undefined) {
          const distance = calculateDistance(
            userLatitude,
            userLongitude,
            ad.latitude,
            ad.longitude
          );
          return distance <= maxDistance;
        }
        return false;
      });
      return filteredAds;
    }

    // Apply pagination
    query.skip(offset).take(limit);

    // Apply sorting by date (createdAt or similar field)
    query.orderBy("ad.updatedAt", orderBy);

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

import {
  Query,
  Resolver,
  Arg,
  Int,
  Float,
  ObjectType,
  Field,
} from "type-graphql";
import { Ad, Status } from "../entities/Ad";
import { dataSource } from "../datasource";
import { redisClient } from "../utils/redisClient";
import { CACHE_EXPIRATION } from "../constants/cache";

@ObjectType()
export class AdsResponse {
  @Field(() => [Ad])
  ads!: Ad[];

  @Field()
  totalCount!: number;
}

@Resolver(Ad)
export class AdQueries {
  @Query(() => AdsResponse)
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
  ): Promise<AdsResponse> {
    // const cacheKey = `ads:all:${skillId || "all"}:${mangoAmountMin || "min"}:${
    //   mangoAmountMax || "max"
    // }:${durationMin || "dmin"}:${durationMax || "dmax"}:${status || "all"}:${
    //   maxDistance || "dist"
    // }:${userLatitude || "lat"}:${
    //   userLongitude || "lng"
    // }:${page}:${limit}:${orderBy}`;

    // Check if the data is cached
    // const cachedData = await redisClient.get(cacheKey);
    // if (cachedData) {
    //   return JSON.parse(cachedData);
    // }

    // Calculate the offset to determine the starting point of the ads for the given page and limit.
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
      maxDistance > 0 &&
      userLatitude !== undefined &&
      userLongitude !== undefined
    ) {
      query.andWhere(
        `6371 * acos(cos(radians(:latitude)) * cos(radians(ad.latitude)) * cos(radians(ad.longitude) - radians(:longitude)) + sin(radians(:latitude)) * sin(radians(ad.latitude))) <= :maxDistance`,
        { latitude: userLatitude, longitude: userLongitude, maxDistance }
      );
    }

    // Get the total count of the filtered ads (without pagination)
    const totalCount = await query.getCount();

    // Apply pagination
    query.skip(offset).take(limit);

    // Apply sorting by date (createdAt or similar field)
    query.orderBy("ad.updatedAt", orderBy);

    const ads = await query.getMany();

    return {
      ads,
      totalCount: totalCount,
    };

    // await redisClient.set(cacheKey, JSON.stringify(results), {
    //   EX: CACHE_EXPIRATION.GET_ALL_ADS,
    // });
  }

  @Query(() => Ad)
  async getAdById(@Arg("id") id: string): Promise<Ad | null> {
    const ad: Ad | null = await dataSource.manager.findOne(Ad, {
      where: { id },
    });

    if (!ad) {
      throw new Error(`Ad not found for id : ${id}`);
    }

    return ad;
  }

  @Query(() => [Ad])
  async getAdsByUser(
    @Arg("userId") userId: string,
    @Arg("status", () => Status, { nullable: true }) status?: Status
  ): Promise<Ad[]> {
    const query: any = { userRequester: { id: userId } };

    // Apply status filter is provided
    if (status !== undefined) {
      query.status = status;
    }

    const ads: Ad[] = await dataSource.manager.find(Ad, {
      where: query,
      order: {
        updatedAt: "DESC",
      },
    });

    return ads;
  }
}

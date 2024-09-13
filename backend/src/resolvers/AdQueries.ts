import { Query, Resolver, Arg, Int, Float } from "type-graphql";
import { Ad } from "../entities/Ad";
import { dataSource } from "../datasource";

@Resolver(Ad)
export class AdQueries {
  @Query((type) => Ad)
  async getAdById(@Arg("id") id: string): Promise<Ad | null> {
    const ad: Ad | null = await Ad.findOne({ where: { id } });
    return ad;
  }

  @Query((type) => [Ad])
  async getAdsByUser(@Arg("userId") userId: string): Promise<Ad[]> {
    const ads: Ad[] = await Ad.findBy({ userRequester: { id: userId } });
    return ads;
  }
}

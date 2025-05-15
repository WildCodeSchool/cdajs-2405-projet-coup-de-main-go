import { Status } from "../entities/Ad";
import { redisClient } from "./redisClient";

// Fonction utilitaire pour générer une clé de cache unique pour chaque requête getAllAds
export const generateCacheKey = (
  skillId?: string,
  mangoAmountMin?: number,
  mangoAmountMax?: number,
  durationMin?: number,
  durationMax?: number,
  status?: Status,
  maxDistance?: number,
  userLatitude?: number,
  userLongitude?: number,
  page: number = 1,
  limit: number = 15,
  orderBy: "ASC" | "DESC" = "DESC"
): string => {
  return (
    "ads:" +
    [
      `skill=${skillId ?? "all"}`,
      `minMango=${mangoAmountMin ?? "none"}`,
      `maxMango=${mangoAmountMax ?? "none"}`,
      `minDur=${durationMin ?? "none"}`,
      `maxDur=${durationMax ?? "none"}`,
      `status=${status ?? "all"}`,
      `dist=${maxDistance ?? "none"}`,
      `lat=${userLatitude ?? "none"}`,
      `lng=${userLongitude ?? "none"}`,
      `page=${page}`,
      `limit=${limit}`,
      `order=${orderBy}`,
    ].join(":")
  );
};

export const invalidateAdsCache = async (): Promise<void> => {
  try {
    let cursor = 0;
    let totalDeleted = 0;

    do {
      const result = await redisClient.scan(cursor, {
        MATCH: "ads:*",
        COUNT: 100,
      });

      cursor = Number(result.cursor);
      const keys = result.keys;

      if (keys.length > 0) {
        await redisClient.del(keys);
        totalDeleted += keys.length;
      }
    } while (cursor !== 0);
  } catch (error) {
    console.error("Erreur lors de l'invalidation du cache :", error);
  }
};

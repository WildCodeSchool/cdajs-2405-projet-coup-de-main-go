import { Resolver, Query, Arg, UseMiddleware } from "type-graphql";
import { Chat } from "../entities/Chat";
import { User } from "../entities/User";
import { dataSource } from "../datasource";
import { checkUserId } from "../middlewares/userAuthMiddleware";
import { redisClient } from "../utils/redisClient";
import { CACHE_EXPIRATION } from "../constants/cache";

@Resolver(Chat)
export class ChatQueries {
    @Query(() => [Chat], { nullable: true })
    @UseMiddleware(checkUserId)
    async getChatsByUserId(
        @Arg("userId") userId: string
    ): Promise<Chat[] | null> {
        const cacheKey = `chats:user:${userId}`;

        // Check if the data is cached
        // const cachedData = await redisClient.get(cacheKey);
        // if (cachedData) {
        //     const parsedData = JSON.parse(cachedData);
        //     const formatData = parsedData.map((chat: any) => ({
        //         ...chat,
        //         messages: chat.__messages__ || chat.messages || [],
        //     }));

        //     return formatData;
        // }

        // Check if the user exists
        const user = await dataSource.manager.findOne(User, {
            where: { id: userId },
        });

        if (!user) {
            throw new Error("L'utilisateur spécifié n'existe pas.");
        }

        // Get all chats where the user is the requester or the helper
        const chats = await dataSource.manager.find(Chat, {
            where: [
                { userHelper: { id: user.id } },
                { userRequester: { id: user.id } },
            ],
            relations: ["messages"],
            order: {
                messages: {
                    date: "ASC",
                },
            },
        });

        // Cache the result
        // await redisClient.set(cacheKey, JSON.stringify(chats), {
        //     EX: CACHE_EXPIRATION.CHATS_BY_USER,
        // });

        return chats;
    }

    @Query(() => [Chat], { nullable: true })
    @UseMiddleware(checkUserId)
    async getChatByUserAndAdId(
        @Arg("userId") userId: string,
        @Arg("adId") adId: string
    ): Promise<Chat[] | null> {
        const user = await dataSource.manager.findOne(User, {
            where: { id: userId },
        });

        if (!user) {
            throw new Error("L'utilisateur spécifié n'existe pas.");
        }

        const chat = await dataSource.manager.find(Chat, {
            where: [
                { userHelper: { id: user.id }, ad: { id: adId } },
                { userRequester: { id: user.id }, ad: { id: adId } },
            ],
            relations: ["messages", "ad"],
        });

        return chat.length > 0 ? chat : null;
    }
}

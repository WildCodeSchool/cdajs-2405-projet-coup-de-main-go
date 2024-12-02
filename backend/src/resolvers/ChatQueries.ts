import { Resolver, Query, Arg, UseMiddleware } from "type-graphql";
import { Chat } from "../entities/Chat";
import { User } from "../entities/User";
import { dataSource } from "../datasource";
import { checkUserId } from "../middlewares/userAuthMiddleware";

@Resolver(Chat)
export class ChatQueries {
  @Query(() => [Chat], { nullable: true })
  @UseMiddleware(checkUserId)
  async getChatsByUserId(
    @Arg("userId") userId: string
  ): Promise<Chat[] | null> {
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

    return chats;
  }
}

import { Resolver, Query, Arg } from "type-graphql";
import { Chat } from "../entities/Chat";
import { User } from "../entities/User";
import { dataSource } from "../datasource";

@Resolver(Chat)
export class ChatQueries {
  @Query(() => [Chat], { nullable: true })
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
    const chatRepository = dataSource.getRepository(Chat);
    const chats = await chatRepository.find({
      where: [
        { userHelper: { id: user.id } },
        { userRequester: { id: user.id } },
      ],
    });

    return chats;
  }
}
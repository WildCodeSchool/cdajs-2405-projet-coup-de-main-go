import { Resolver, Query, Arg } from "type-graphql";
import { Message } from "../entities/Message";
import { Chat } from "../entities/Chat";

@Resolver(Message)
export class MessageQueries {
  @Query(() => [Message], { nullable: true })
  async getMessagesByChatId(
    @Arg("chatId") chatId: string
  ): Promise<Message[] | null> {
    let chat: Chat;
    try {
      // Check if the chat exists
      chat = await Chat.findOneOrFail({
        where: { id: chatId },
      });
    } catch {
      throw new Error("Le chat spécifié n'existe pas.");
    }

    const messages = await Message.find({
      where: { chat: { id: chat.id } },
      order: { date: "ASC" },
    });

    return messages;
  }
}
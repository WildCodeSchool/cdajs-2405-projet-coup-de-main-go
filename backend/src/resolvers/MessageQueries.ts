import { Resolver, Query, Arg } from "type-graphql";
import { Message } from "../entities/Message";
import { Chat } from "../entities/Chat";
import { dataSource } from "../datasource";

@Resolver(Message)
export class MessageQueries {
    @Query(() => [Message], { nullable: true })
    async getMessagesByChatId(
        @Arg("chatId") chatId: string
    ): Promise<Message[] | null> {
        // Check if the chat exists
        const chat = await dataSource.manager.findOne(Chat, {
            where: { id: chatId },
        });

        if (!chat) {
            throw new Error("Le chat spécifié n'existe pas.");
        }

        const messages = await dataSource.manager.find(Message, {
            where: { chat: { id: chat.id } },
            order: { date: "ASC" },
        });

        return messages;
    }
}

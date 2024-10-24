import { Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import { Message } from "../entities/Message";
import { Chat } from "../entities/Chat";
import { User } from "../entities/User";
import { dataSource } from "../datasource";

@InputType()
export class MessageInput {
    @Field()
    message!: string;

    @Field()
    isView!: boolean;

    @Field()
    chatId!: string;

    @Field()
    authorId!: string;
}

@Resolver(Message)
export class MessageMutations {
    @Mutation(() => Message)
    async sendMessage(
        @Arg("messageData") messageData: MessageInput
    ): Promise<Message> {
        // Check if the chat exists
        const chat = await dataSource.manager.findOne(Chat, {
            where: { id: messageData.chatId },
        });

        if (!chat) {
            throw new Error("Le chat spécifié n'existe pas.");
        }

        // Check if the user exists
        const author = await dataSource.manager.findOne(User, {
            where: { id: messageData.authorId },
        });

        if (!author) {
            throw new Error("L'utilisateur spécifié n'existe pas.");
        }

        // Check if the user is part of the chat
        if (
            chat.userHelper!.id !== author.id &&
            chat.userRequester!.id !== author.id
        ) {
            throw new Error(
                "L'utilisateur spécifié ne fait pas partie du chat spécifié."
            );
        }

        try {
            const message = dataSource.manager.create(Message, {
                message: messageData.message,
                chat,
                author,
                isView: messageData.isView,
            });

            await dataSource.manager.save(message);
            return message;
        } catch (error) {
            console.error(
                "Erreur inattendue lors de l'envoi du message:",
                error
            );
            throw new Error(
                "Une erreur inattendue est survenue lors de l'envoi du message."
            );
        }
    }
}

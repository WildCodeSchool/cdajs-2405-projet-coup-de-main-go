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
    isViewedByRequester!: boolean;

    @Field()
    isViewedByHelper!: boolean;

    @Field()
    chatId!: string;

    @Field()
    authorId!: string;
}

@Resolver(Message)
export class MessageMutations {
    @Mutation(() => Message)
    async sendMessage(
        @Arg("messageData") messageData: MessageInput,
        @Arg("currentUserId") currentUserId: string
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

        let isViewedByRequester = messageData.isViewedByRequester;
        let isViewedByHelper = messageData.isViewedByHelper;

        // Automatically set the viewed status based on the current user 
        if ((chat.userRequester?.id)?.toString() === currentUserId) {
            isViewedByRequester = true;
        } else if ((chat.userHelper?.id)?.toString() === currentUserId) {
            isViewedByHelper = true;
        }

        try {
            const message = dataSource.manager.create(Message, {
                message: messageData.message,
                chat,
                author,
                isViewedByRequester,
                isViewedByHelper,
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

    @Mutation(() => Boolean)
    async markMessagesAsReadForUser(
      @Arg("chatId") chatId: string,
      @Arg("userId") userId: string
    ): Promise<boolean> {
      // Check if the chat exists
      const chat = await dataSource.manager.findOne(Chat, {
        where: { id: chatId }
      });      
    
      if (!chat) {
        throw new Error("Le chat spécifié n'existe pas.");
      }
    
      // Check if the user exists and is part of the chat
      const isRequester = (chat.userRequester?.id)?.toString() === userId;
      const isHelper = (chat.userHelper?.id)?.toString() === userId;
    
      if (!isRequester && !isHelper) {
        throw new Error(
          "L'utilisateur spécifié ne fait pas partie du chat."
        );
      }
    
      try {
        // Update messages as read by the user in the chat
        if (isRequester) {
          await dataSource.manager.update(
            Message,
            { chat: { id: chatId }, isViewedByRequester: false },
            { isViewedByRequester: true }
          );
        } else if (isHelper) {
          await dataSource.manager.update(
            Message,
            { chat: { id: chatId }, isViewedByHelper: false },
            { isViewedByHelper: true }
          );
        }
    
        return true;
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour des messages comme lus:",
          error
        );
        throw new Error(
          "Une erreur est survenue lors de la mise à jour des messages comme lus."
        );
      }
    }    
  }
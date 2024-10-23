import { Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import { Message } from "../entities/Message";
import { Chat } from "../entities/Chat";
import { User } from "../entities/User";

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
    const chat = await Chat.findOne({
      where: { id: messageData.chatId },
    });

    if (!chat) {
      throw new Error("Le chat spécifié n'existe pas.");
    }

    // Check if the user exists
    const author = await User.findOne({
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
      const message = Message.create({
        message: messageData.message,
        chat,
        author,
        isView: messageData.isView,
      });

      await message.save();
      return message;
    } catch (error) {
      console.error("Erreur inattendue lors de l'envoi du message:", error);
      throw new Error(
        "Une erreur inattendue est survenue lors de l'envoi du message."
      );
    }
  }
}
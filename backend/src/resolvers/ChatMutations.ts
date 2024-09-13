import { Resolver, Mutation, Arg, Field, InputType } from "type-graphql";
import { Chat } from "../entities/Chat";
import { Ad } from "../entities/Ad";
import { User } from "../entities/User";

@InputType()
export class ChatInput {
  @Field()
  adId!: string;

  @Field()
  userRequesterId!: string;

  @Field()
  userHelperId!: string;
}

@Resolver(Chat)
export class ChatMutations {
  @Mutation(() => Chat)
  async createChat(@Arg("chatData") chatData: ChatInput): Promise<Chat> {
    // Check if the requester and the helper are the same person
    if (chatData.userRequesterId === chatData.userHelperId) {
      throw new Error(
        "Le requester et le helper ne peuvent pas être la même personne."
      );
    }

    // Check if the requester user exists
    const userRequester = await User.findOne({
      where: { id: chatData.userRequesterId },
    });

    if (!userRequester) {
      throw new Error("L'utilisateur requester spécifié n'existe pas.");
    }

    // Check if the helper user exists
    const userHelper = await User.findOne({
      where: { id: chatData.userHelperId },
    });
    
    if (!userHelper) {
      throw new Error("L'utilisateur helper spécifié n'existe pas.");
    }

    // Check if the ad exists and belongs to the requester
    const ad = await Ad.findOne({
      where: {
        id: chatData.adId,
        userRequester: { id: chatData.userRequesterId },
      },
    });

    if (!ad) {
      throw new Error(
        "L'annonce spécifiée n'existe pas ou n'appartient pas à l'utilisateur requester."
      );
    }

    // Check if a chat already exists for this ad between these two users
    const existingChat = await Chat.findOne({
      where: {
        ad: { id: chatData.adId },
        userRequester: { id: chatData.userRequesterId },
        userHelper: { id: chatData.userHelperId },
      },
    });

    if (existingChat) {
      throw new Error(
        "Un chat existe déjà pour cette annonce entre ces deux utilisateurs."
      );
    }

    try {
      const chat = Chat.create({
        ad,
        userRequester,
        userHelper,
      });

      await chat.save();
      return chat;
    } catch (error) {
      console.error("Erreur inattendue lors de la création du chat:", error);
      throw new Error(
        "Une erreur inattendue est survenue lors de la création du chat."
      );
    }
  }
}
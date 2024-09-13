import { Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import { Transaction } from "../entities/Transaction";
import { Ad } from "../entities/Ad";
import { User } from "../entities/User";

@InputType()
export class TransactionInput {
  @Field()
  adId!: string;

  @Field()
  userRequesterId!: string;

  @Field()
  userHelperId!: string;
}

@Resolver(Transaction)
export class TransactionMutations {
  @Mutation(() => Transaction)
  async addTransaction(
    @Arg("transactionData") transactionData: TransactionInput
  ): Promise<Transaction> {
    // Check if the requester and the helper are different
    if (transactionData.userRequesterId === transactionData.userHelperId) {
      throw new Error(
        "L'utilisateur demandeur ne peut pas être le même que l'utilisateur aide."
      );
    }

    // Check if the ad already has a transaction
    const existingTransaction = await Transaction.findOne({
      where: { ad: { id: transactionData.adId } },
    });

    if (existingTransaction) {
      throw new Error("L'annonce spécifiée a déjà une transaction associée.");
    }

    let ad: Ad;
    try {
      // Check if the ad exists
      ad = await Ad.findOneOrFail({
        where: { id: transactionData.adId },
      });
    } catch {
      throw new Error("L'annonce spécifiée n'existe pas.");
    }

    let userRequester: User;
    try {
      // Check if the requester user exists
      userRequester = await User.findOneOrFail({
        where: { id: transactionData.userRequesterId },
      });
    } catch {
      throw new Error("L'utilisateur requester spécifié n'existe pas.");
    }

    let userHelper: User;
    try {
      // Check if the helper user exists
      userHelper = await User.findOneOrFail({
        where: { id: transactionData.userHelperId },
      });
    } catch {
      throw new Error("L'utilisateur helper spécifié n'existe pas.");
    }

    // Create and save the transaction
    try {
      const transaction = Transaction.create({
        ad,
        userRequester,
        userHelper,
      });

      await transaction.save();
      return transaction;
    } catch (error) {
      console.error(
        "Erreur inattendue lors de la création de la transaction:",
        error
      );
      throw new Error(
        "Une erreur inattendue est survenue lors de la création de la transaction."
      );
    }
  }
}
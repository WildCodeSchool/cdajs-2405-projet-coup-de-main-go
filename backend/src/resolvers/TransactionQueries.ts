import { Resolver, Query, Arg } from "type-graphql";
import { Transaction } from "../entities/Transaction";
import { User } from "../entities/User";

@Resolver(Transaction)
export class TransactionQueries {
  @Query(() => [Transaction], { nullable: true })
  async getTransactionsHistoryByUser(
    @Arg("userId") userId: string
  ): Promise<Transaction[] | null> {
    let user: User;
    try {
      // Check if the user exists
      user = await User.findOneOrFail({
        where: { id: userId },
      });
    } catch {
      throw new Error("L'utilisateur spécifié n'existe pas.");
    }

    // Get all transactions where the user is either the requester or the helper
    const transactions = await Transaction.find({
      where: [
        { userHelper: { id: user.id } },
        { userRequester: { id: user.id } },
      ],
      relations: ["ad"],
    });

    return transactions;
  }
}
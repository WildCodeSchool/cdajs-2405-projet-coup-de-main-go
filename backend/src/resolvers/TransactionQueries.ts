import { Resolver, Query, Arg } from "type-graphql";
import { Transaction } from "../entities/Transaction";
import { User } from "../entities/User";
import { dataSource } from "../datasource";

@Resolver(Transaction)
export class TransactionQueries {
    @Query(() => [Transaction], { nullable: true })
    async getTransactionsHistoryByUser(
        @Arg("userId") userId: string
    ): Promise<Transaction[] | null> {
        // Check if the user exists
        const user = await dataSource.manager.findOne(User, {
            where: { id: userId },
        });
        if (!user) {
            throw new Error("L'utilisateur spécifié n'existe pas.");
        }

        // Get all transactions where the user is either the requester or the helper
        const transactions = await dataSource.manager.find(Transaction, {
            where: [
                { userHelper: { id: user.id } },
                { userRequester: { id: user.id } },
            ],
            relations: ["ad"],
        });

        return transactions;
    }
}

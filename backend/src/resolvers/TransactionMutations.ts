import { Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import { Transaction } from "../entities/Transaction";
import { Ad } from "../entities/Ad";
import { User } from "../entities/User";
import { dataSource } from "../datasource";

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
        const existingTransaction = await dataSource.manager.findOne(
            Transaction,
            {
                where: { ad: { id: transactionData.adId } },
            }
        );

        if (existingTransaction) {
            throw new Error(
                "L'annonce spécifiée a déjà une transaction associée."
            );
        }

        // Check if the ad exists
        const ad = await dataSource.manager.findOne(Ad, {
            where: { id: transactionData.adId },
        });

        if (!ad) {
            throw new Error("L'annonce spécifiée n'existe pas.");
        }

        // Check if the requester user exists
        const userRequester = await dataSource.manager.findOne(User, {
            where: { id: transactionData.userRequesterId },
        });

        if (!userRequester) {
            throw new Error("L'utilisateur requester spécifié n'existe pas.");
        }

        // Check if the helper user exists
        const userHelper = await dataSource.manager.findOne(User, {
            where: { id: transactionData.userHelperId },
        });
        if (!userHelper) {
            throw new Error("L'utilisateur helper spécifié n'existe pas.");
        }

        console.log(ad.userRequester?.id);
        console.log(transactionData.userRequesterId);

        // Check if the ad is linked to the correct requester user
        if (
            ad.userRequester?.id?.toString() !== transactionData.userRequesterId
        ) {
            throw new Error(
                "L'utilisateur demandeur n'est pas le propriétaire de l'annonce spécifiée."
            );
        }

        // Create and save the transaction
        try {
            const transaction = dataSource.manager.create(Transaction, {
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

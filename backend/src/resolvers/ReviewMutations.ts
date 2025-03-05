import { Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import { Review } from "../entities/Review";
import { User } from "../entities/User";
import { dataSource } from "../datasource";

@InputType()
export class ReviewInput {
    @Field()
    title!: string;

    @Field({ nullable: true })
    comment?: string;

    @Field()
    rating!: number;

    @Field()
    userHelperId!: string;

    @Field()
    userRequesterId!: string;
}

@Resolver(Review)
export class ReviewMutations {
    @Mutation(() => Review)
    async createReview(
        @Arg("reviewData") reviewData: ReviewInput
    ): Promise<Review> {
        // Check if the user as a helper is not the same as the user as a requester
        if (reviewData.userHelperId === reviewData.userRequesterId) {
            throw new Error(
                "L'utilisateur demandeur ne peut pas être le même que l'utilisateur aide."
            );
        }

        // Check if the rating is between 0 and 5 and is a multiple of 0.5
        if (
            reviewData.rating < 0 ||
            reviewData.rating > 5 ||
            reviewData.rating % 0.5 !== 0
        ) {
            throw new Error(
                "La note doit être comprise entre 0 et 5 et être un multiple de 0.5."
            );
        }

        // Check if the requester user exists
        const userRequester = await dataSource.manager.findOne(User, {
            where: { id: reviewData.userRequesterId },
        });

        if (!userRequester) {
            throw new Error("L'utilisateur requester spécifié n'existe pas.");
        }

        // Check if the helper user exists
        const userHelper = await dataSource.manager.findOne(User, {
            where: { id: reviewData.userHelperId },
        });

        if (!userHelper) {
            throw new Error("L'utilisateur helper spécifié n'existe pas.");
        }

        try {
            const review = dataSource.manager.create(Review, {
                title: reviewData.title,
                comment: reviewData.comment,
                rating: reviewData.rating,
                userHelper,
                userRequester,
            });

            await dataSource.manager.save(review);
            return review;
        } catch (error) {
            console.error(
                "Erreur inattendue lors de la création de la revue:",
                error
            );
            throw new Error(
                "Une erreur inattendue est survenue lors de la création de la revue."
            );
        }
    }
}

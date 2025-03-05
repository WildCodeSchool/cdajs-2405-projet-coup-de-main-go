import { Resolver, Query, Arg } from "type-graphql";
import { Review } from "../entities/Review";
import { User } from "../entities/User";
import { dataSource } from "../datasource";

@Resolver(Review)
export class ReviewQueries {
    @Query(() => [Review], { nullable: true })
    async getReviewsByUserHelperId(
        @Arg("userHelperId") userId: string
    ): Promise<Review[] | null> {
        // Check if the user exists
        const user = await dataSource.manager.findOne(User, {
            where: { id: userId },
        });

        if (!user) {
            throw new Error("L'utilisateur spécifié n'existe pas.");
        }

        // Get all reviews of the user as a helper
        const reviews = await dataSource.manager.find(Review, {
            where: { userHelper: user },
        });

        if (!reviews) {
            throw new Error(
                "Une erreur est survenue lors de la récupération des avis."
            );
        }

        return reviews;
    }
}

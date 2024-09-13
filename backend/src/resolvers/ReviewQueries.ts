import { Resolver, Query, Arg } from "type-graphql";
import { Review } from "../entities/Review";
import { User } from "../entities/User";

@Resolver(Review)
export class ReviewQueries {
  @Query(() => [Review], { nullable: true })
  async getReviewsByUserHelperId(
    @Arg("userHelperId") userId: string
  ): Promise<Review[] | null> {
    // Check if the user exists
    let user: User;
    try {
      user = await User.findOneOrFail({
        where: { id: userId },
      });
    } catch {
      throw new Error("L'utilisateur spécifié n'existe pas.");
    }

    // Get all reviews of the user as a helper
    let reviews: Review[];
    try {
      reviews = await Review.find({
        where: { userHelper: user },
      });
    } catch {
      throw new Error(
        "Une erreur est survenue lors de la récupération des avis."
      );
    }

    return reviews;
  }
}
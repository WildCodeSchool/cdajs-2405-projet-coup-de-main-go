import { mockTypeOrm } from "../tests_mockTypeorm-config";
import { faker } from "@faker-js/faker";
import { ReviewQueries } from "../resolvers/ReviewQueries";
import { User } from "../entities/User";
import { Review } from "../entities/Review";

describe("getReviewsByUserHelperId", () => {
    let reviewQueries: ReviewQueries;
    let userHelper: User;
    let userRequester: User;

    beforeEach(() => {
        reviewQueries = new ReviewQueries();

        userHelper = new User(
            faker.person.firstName(),
            faker.person.lastName(),
            faker.internet.email(),
            faker.internet.password(),
            faker.image.avatar(),
            faker.location.streetAddress(),
            faker.location.zipCode(),
            faker.location.city()
        );
        userHelper.id = faker.string.uuid();

        userRequester = new User(
            faker.person.firstName(),
            faker.person.lastName(),
            faker.internet.email(),
            faker.internet.password(),
            faker.image.avatar(),
            faker.location.streetAddress(),
            faker.location.zipCode(),
            faker.location.city()
        );
        userRequester.id = faker.string.uuid();
    });

    const createMockReviews = (count: number): Review[] => {
        return Array.from({ length: count }, () => {
            const review = new Review(
                faker.lorem.sentence(),
                faker.lorem.paragraph(),
                faker.number.float({ min: 0, max: 5, multipleOf: 0.5 }),
                userHelper,
                userRequester
            );
            return review;
        });
    };

    it("should return reviews for the given user helper ID", async () => {
        const mockReviews = createMockReviews(3);
        mockTypeOrm().onMock(User).toReturn(userHelper, "findOne");
        mockTypeOrm().onMock(Review).toReturn(mockReviews, "find");

        const reviews = await reviewQueries.getReviewsByUserHelperId(
            userHelper.id!
        );

        expect(reviews).toHaveLength(3);
        expect(reviews).toEqual(mockReviews);
    });

    it("should throw an error if the user helper does not exist", async () => {
        mockTypeOrm().onMock(User).toReturn(null, "findOne");

        await expect(
            reviewQueries.getReviewsByUserHelperId(userHelper.id!)
        ).rejects.toThrow("L'utilisateur spécifié n'existe pas.");
    });

    it("should return an empty array if the user helper has no reviews", async () => {
        mockTypeOrm().onMock(User).toReturn(userHelper, "findOne");
        mockTypeOrm().onMock(Review).toReturn([], "find");

        const reviews = await reviewQueries.getReviewsByUserHelperId(
            userHelper.id!
        );

        expect(reviews).toEqual([]);
    });
});

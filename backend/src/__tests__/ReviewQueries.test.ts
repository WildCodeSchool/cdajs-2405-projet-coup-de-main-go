import { MockTypeORM } from "mock-typeorm";
import { faker } from "@faker-js/faker";
import { ReviewQueries } from "../resolvers/ReviewQueries";
import { User } from "../entities/User";
import { Review } from "../entities/Review";

describe("getReviewsByUserHelperId", () => {
  let reviewQueries: ReviewQueries;
  let typeorm: MockTypeORM;
  let userHelper: User;
  let userRequester: User;

  beforeAll(() => {
    typeorm = new MockTypeORM();
  });

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

  afterEach(() => {
    typeorm.resetAll();
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
    typeorm.onMock(User).toReturn(userHelper, "findOne");
    typeorm.onMock(Review).toReturn(mockReviews, "find");

    const reviews = await reviewQueries.getReviewsByUserHelperId(
      userHelper.id!
    );

    expect(reviews).toHaveLength(3);
    expect(reviews).toEqual(mockReviews);
  });

  it("should throw an error if the user helper does not exist", async () => {
    typeorm.onMock(User).toReturn(null, "findOne");

    await expect(
      reviewQueries.getReviewsByUserHelperId(userHelper.id!)
    ).rejects.toThrow("L'utilisateur spécifié n'existe pas.");
  });

  it("should return an empty array if the user helper has no reviews", async () => {
    typeorm.onMock(User).toReturn(userHelper, "findOne");
    typeorm.onMock(Review).toReturn([], "find");

    const reviews = await reviewQueries.getReviewsByUserHelperId(
      userHelper.id!
    );

    expect(reviews).toEqual([]);
  });
});

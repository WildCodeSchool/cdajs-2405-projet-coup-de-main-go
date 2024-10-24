import { MockTypeORM } from "mock-typeorm";
import { faker } from "@faker-js/faker";
import { ReviewMutations, ReviewInput } from "../resolvers/ReviewMutations";
import { User } from "../entities/User";
import { Review } from "../entities/Review";

describe("createReview", () => {
  let reviewMutations: ReviewMutations;
  let typeorm: MockTypeORM;
  let userRequester: User;
  let userHelper: User;
  let reviewData: ReviewInput;

  beforeAll(() => {
    typeorm = new MockTypeORM();
  });

  beforeEach(() => {
    reviewMutations = new ReviewMutations();

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

    reviewData = {
      title: faker.lorem.sentence(),
      comment: faker.lorem.paragraph(),
      rating: faker.number.float({ min: 0, max: 5, multipleOf: 0.5 }),
      userHelperId: userHelper.id!,
      userRequesterId: userRequester.id!,
    };
  });

  afterEach(() => {
    typeorm.resetAll();
  });

  it("should successfully create a review", async () => {
    typeorm.onMock(User).toReturn(userRequester, "findOne");
    typeorm.onMock(User).toReturn(userHelper, "findOne");
    typeorm.onMock(Review).toReturn(null, "save");

    const review = await reviewMutations.createReview(reviewData);

    expect(review).toBeInstanceOf(Review);
    expect(review.title).toBe(reviewData.title);
    expect(review.userHelper.id).toBe(userHelper.id);
    expect(review.userRequester.id).toBe(userRequester.id);
  });

  it("should throw an error if userHelper and userRequester are the same", async () => {
    const invalidReviewData = { ...reviewData, userHelperId: userRequester.id! };

    await expect(reviewMutations.createReview(invalidReviewData)).rejects.toThrow(
      "L'utilisateur demandeur ne peut pas être le même que l'utilisateur aide."
    );
  });

  it("should throw an error if the rating is not valid", async () => {
    const invalidReviewData = { ...reviewData, rating: 5.5 };

    await expect(reviewMutations.createReview(invalidReviewData)).rejects.toThrow(
      "La note doit être comprise entre 0 et 5 et être un multiple de 0.5."
    );
  });

  it("should throw an error if the userRequester does not exist", async () => {
    typeorm.onMock(User).toReturn(null, "findOne");

    await expect(reviewMutations.createReview(reviewData)).rejects.toThrow(
      "L'utilisateur requester spécifié n'existe pas."
    );
  });
});
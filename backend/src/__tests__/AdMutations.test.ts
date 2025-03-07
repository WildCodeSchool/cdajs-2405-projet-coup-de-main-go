import { mockTypeOrm } from "../tests_mockTypeorm-config";
import { faker } from "@faker-js/faker";
import { Ad } from "../entities/Ad";
import { AdMutations } from "../resolvers/AdMutations";
import { Skill } from "../entities/Skill";
import { User } from "../entities/User";
import { Transaction } from "../entities/Transaction";

describe("deleteAd", () => {
  let adMutations: AdMutations;
  let ad: Ad;
  let userRequester: User;
  let skill: Skill;

  beforeEach(() => {
    adMutations = new AdMutations();

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

    skill = new Skill(faker.lorem.word(), faker.image.url());

    ad = new Ad(
      faker.lorem.word(),
      faker.lorem.sentence(),
      faker.location.streetAddress(),
      faker.location.zipCode(),
      faker.location.city(),
      faker.number.int(),
      faker.number.int(),
      userRequester,
      skill
    );

    ad.id = faker.string.uuid();
  });

  it("should throw 'Ad not found' if ad does not exist", async () => {
    mockTypeOrm().onMock(Ad).toReturn(null, "findOne");

    await expect(
      adMutations.deleteAd(ad.id!, userRequester.id!)
    ).rejects.toThrow("Ad not found");
  });

  it("should throw 'Ad is associated to a transaction' if ad is associated to a transaction", async () => {
    mockTypeOrm().onMock(Ad).toReturn(ad, "findOne");
    mockTypeOrm().onMock(Transaction).toReturn(true, "findOne");

    await expect(
      adMutations.deleteAd(ad.id!, userRequester.id!)
    ).rejects.toThrow("Ad is associated to a transaction");
  });

  it("should delete ad and return true", async () => {
    mockTypeOrm().onMock(Ad).toReturn(ad, "findOne");
    mockTypeOrm().onMock(Transaction).toReturn(false, "findOne");

    await expect(adMutations.deleteAd(ad.id!, userRequester.id!)).resolves.toBe(
      true
    );
  });
});

import { Ad } from "../entities/Ad";
import { AdQueries } from "../resolvers/AdQueries";
import { User } from "../entities/User";
import { faker } from "@faker-js/faker";
import { MockTypeORM } from "mock-typeorm";
import { Skill } from "../entities/Skill";
import { dataSource } from "../datasource";

describe("getAllAds", () => {
  let ads: Ad[];
  let adQueries: AdQueries;
  let mockUser: User;
  let skill: Skill;
  const durationArray: number[] = [30, 60, 90];
  let typeorm: MockTypeORM;

  const createMockAds = (count: number): Ad[] => {
    return Array.from({ length: count }, () => {
      const duration = faker.helpers.arrayElement(durationArray);
      return new Ad(
        faker.lorem.word(),
        faker.lorem.sentence(),
        faker.location.streetAddress(),
        faker.location.zipCode(),
        faker.location.city(),
        duration,
        durationArray.indexOf(duration) + 1,
        mockUser,
        skill
      );
    });
  };

  beforeAll(() => {
    mockUser = new User(
      faker.person.firstName(),
      faker.person.lastName(),
      faker.internet.email(),
      faker.internet.password(),
      faker.image.avatar(),
      faker.location.streetAddress(),
      faker.location.zipCode(),
      faker.location.city()
    );
    skill = new Skill(faker.lorem.word(), faker.image.url());
    typeorm = new MockTypeORM();
  });

  beforeEach(() => {
    adQueries = new AdQueries();
    ads = createMockAds(5);
    jest
      .spyOn(dataSource.getRepository(Ad), "createQueryBuilder")
      .mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(ads),
        andWhere: jest.fn().mockReturnThis(),
      } as any);
  });

  it("should return the length of ads array when no argument is provided", async () => {
    const retrievedAds: Ad[] = await adQueries.getAllAds();
    expect(retrievedAds.length).toBe(ads.length);
    expect(retrievedAds).toEqual(ads);
  });
});

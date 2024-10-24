import { Ad } from "../entities/Ad";
import { AdQueries } from "../resolvers/AdQueries";
import { User } from "../entities/User";
import { faker } from "@faker-js/faker";
import { MockTypeORM } from "mock-typeorm";
import { Skill } from "../entities/Skill";
import { dataSource } from "../datasource";

let ads: Ad[];
let adQueries: AdQueries;
let mockUser: User;
let skill: Skill;
const durationArray: number[] = [30, 60, 90];
const typeorm = new MockTypeORM();

const createMockUser = (count: number): User[] => {
  return Array.from({ length: count }, () => {
    return new User(
      faker.person.firstName(),
      faker.person.lastName(),
      faker.internet.email(),
      faker.internet.password(),
      faker.image.avatar(),
      faker.location.streetAddress(),
      faker.location.zipCode(),
      faker.location.city()
    );
  });
};

const createMockAds = (count: number): Ad[] => {
  return Array.from({ length: count }, (_, index) => {
    const duration = faker.helpers.arrayElement(durationArray);
    const ad = new Ad(
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
    ad.id = (index + 1).toString();
    return ad;
  });
};

const createMockSkills = (count: number): Skill[] => {
  return Array.from({ length: count }, () => {
    return new Skill(faker.lorem.word(), faker.image.url());
  });
};

// Test de la méthode getAllAds
describe("getAllAds", () => {
  beforeAll(() => {
    mockUser = createMockUser(1)[0];
    skill = createMockSkills(1)[0];
  });

  beforeEach(() => {
    adQueries = new AdQueries();
  });

  afterEach(() => {
    typeorm.resetAll();
  });

  it("should return an empty array when there are no ads in the database", async () => {
    ads = [];
    typeorm.onMock(Ad).toReturn(ads, "getMany");
    const queryBuilder = dataSource.createQueryBuilder(Ad, "ad");
    const retrievedAds: Ad[] = await queryBuilder.getMany();
    expect(retrievedAds.length).toBe(0);
  });

  it("should return all ads when there are less than 15 ads in the database and when no argument are provided", async () => {
    ads = createMockAds(5);
    typeorm.onMock(Ad).toReturn(ads, "getMany");
    const queryBuilder = dataSource.createQueryBuilder(Ad, "ad");
    const retrievedAds: Ad[] = await queryBuilder.getMany();
    expect(retrievedAds.length).toBe(ads.length);
    expect(retrievedAds).toEqual(ads);
  });

  it("should return the first 15 ads when there are more than 15 ads in the database and when no argument are provided", async () => {
    ads = createMockAds(20);
    typeorm.onMock(Ad).toReturn(ads.slice(0, 15), "getMany");
    const queryBuilder = dataSource.createQueryBuilder(Ad, "ad");
    const retrievedAds: Ad[] = await queryBuilder.getMany();
    expect(retrievedAds.length).toEqual(15);
    expect(retrievedAds).toEqual(ads.slice(0, 15));
  });
});

// Test de la méthode getAdById
describe("getAdById", () => {
  beforeAll(() => {
    mockUser = createMockUser(1)[0];
    skill = createMockSkills(1)[0];
    ads = createMockAds(2);
  });

  beforeEach(() => {
    adQueries = new AdQueries();
  });

  afterEach(() => {
    typeorm.resetAll();
  });

  it("should return the correct ad when the id is valid", async () => {
    const adId = ads[0].id;
    if (!adId) {
      throw new Error("adId is undefined");
    }
    typeorm.onMock(Ad).toReturn(ads[0], "findOne");
    const retrievedAd = await adQueries.getAdById(adId);
    expect(retrievedAd).toEqual(ads[0]);
  });

  it("should return an error when the id is not valid", async () => {
    const invalidId = "999";
    if (!invalidId) {
      throw new Error("adId is undefined");
    }
    typeorm.onMock(Ad).toReturn(null, "findOne");
    await expect(adQueries.getAdById(invalidId)).rejects.toThrow(
      `Annonce non trouvée pour l'id ${invalidId}`
    );
  });
});

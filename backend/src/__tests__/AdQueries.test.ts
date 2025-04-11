import { Ad } from "../entities/Ad";
import { AdQueries } from "../resolvers/AdQueries";
import { User } from "../entities/User";
import { faker } from "@faker-js/faker";
import { mockTypeOrm } from "../tests_mockTypeorm-config";
import { Skill } from "../entities/Skill";
import { dataSource } from "../datasource";

let ads: Ad[];
let cheapAds: Ad[];
let expensiveAds: Ad[];
let adsWithSkillId1: Ad[];
let adsWithSkillId2: Ad[];
let adQueries: AdQueries;
let mockUser: User;
let skill: Skill;
const durationArray: number[] = [30, 60, 90];
const durationCheap: number = 30;
const durationExpensive: number = 120;
const mangoAmountCheap: number = 1;
const mangoAmountExpensive: number = 4;

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

const createMockSkills = (count: number): Skill[] => {
  return Array.from({ length: count }, () => {
    return new Skill(faker.lorem.word(), faker.image.url());
  });
};

const createMockSkillWithId = (id: string): Skill => {
  const skill = new Skill(faker.lorem.word(), faker.image.url());
  skill.id = id;
  return skill;
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

const createMockAdsWithSkillId1 = (count: number): Ad[] => {
  return Array.from({ length: count }, (_, index) => {
    const skill = createMockSkillWithId("1");
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

const createMockAdsWithSkillId2 = (count: number): Ad[] => {
  return Array.from({ length: count }, (_, index) => {
    const skill = createMockSkillWithId("2");
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

const createCheapMockAds = (count: number): Ad[] => {
  return Array.from({ length: count }, (_, index) => {
    const ad = new Ad(
      faker.lorem.word(),
      faker.lorem.sentence(),
      faker.location.streetAddress(),
      faker.location.zipCode(),
      faker.location.city(),
      durationCheap,
      mangoAmountCheap,
      mockUser,
      skill
    );
    ad.id = (index + 1).toString();
    return ad;
  });
};

const createExpensiveMockAds = (count: number): Ad[] => {
  return Array.from({ length: count }, (_, index) => {
    const ad = new Ad(
      faker.lorem.word(),
      faker.lorem.sentence(),
      faker.location.streetAddress(),
      faker.location.zipCode(),
      faker.location.city(),
      durationExpensive,
      mangoAmountExpensive,
      mockUser,
      skill
    );
    ad.id = (index + 1).toString();
    return ad;
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
    jest.clearAllMocks();
  });

  it("should return an empty array when there are no ads in the database", async () => {
    ads = [];
    jest
      .spyOn(dataSource.getRepository(Ad), "createQueryBuilder")
      .mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(ads),
        getCount: jest.fn().mockResolvedValue(0),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
      } as any);
    const result = await adQueries.getAllAds();
    expect(result.ads).toEqual([]);
    expect(result.adsCount).toBe(0);
  });

  it("should return all ads when there are less than 15 ads in the database and when no argument are provided", async () => {
    ads = createMockAds(10);
    jest
      .spyOn(dataSource.getRepository(Ad), "createQueryBuilder")
      .mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(ads),
        getCount: jest.fn().mockResolvedValue(ads.length),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
      } as any);
    const result = await adQueries.getAllAds();
    expect(result.ads.length).toBe(ads.length);
    expect(result.ads).toEqual(ads);
    expect(result.adsCount).toBe(ads.length);
  });

  it("should return the first 15 ads when there are more than 15 ads in the database and when no argument are provided", async () => {
    ads = createMockAds(20);

    const skipSpy = jest.fn().mockReturnThis();
    const takeSpy = jest.fn().mockReturnThis();

    jest
      .spyOn(dataSource.getRepository(Ad), "createQueryBuilder")
      .mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        skip: skipSpy,
        take: takeSpy,
        getMany: jest.fn().mockResolvedValue(ads.slice(0, 15)),
        getCount: jest.fn().mockResolvedValue(ads.length),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
      } as any);

    const result = await adQueries.getAllAds();

    expect(result.ads.length).toBe(15);
    expect(result.ads).toEqual(ads.slice(0, 15));
    expect(result.adsCount).toBe(20);
    expect(skipSpy).toHaveBeenCalledWith(0); // default page is 1, so skip(0)
    expect(takeSpy).toHaveBeenCalledWith(15); // default limit is 15
  });

  it("should filter ads by skillId when skillId argument is provided", async () => {
    adsWithSkillId1 = createMockAdsWithSkillId1(3);
    adsWithSkillId2 = createMockAdsWithSkillId2(5);
    const skillId = "1"; //We expect to get only the adsWithSkillId1

    const andWhereSpy = jest.fn().mockReturnThis();

    jest
      .spyOn(dataSource.getRepository(Ad), "createQueryBuilder")
      .mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(adsWithSkillId1),
        getCount: jest.fn().mockResolvedValue(adsWithSkillId1.length),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: andWhereSpy,
      } as any);

    const result = await adQueries.getAllAds(skillId);

    expect(result.ads.length).toBe(adsWithSkillId1.length);
    expect(result.ads).toEqual(adsWithSkillId1);
    expect(result.adsCount).toBe(3);
    expect(andWhereSpy).toHaveBeenCalledWith("ad.skillId = :skillId", {
      skillId: "1",
    });
  });

  it("should filter ads by mangoAmountMin when mangoAmountMin argument is provided", async () => {
    cheapAds = createCheapMockAds(3);
    expensiveAds = createExpensiveMockAds(5);
    const mangoAmountMin = 3; //We expect to get only the expensive ads

    const andWhereSpy = jest.fn().mockReturnThis();

    jest
      .spyOn(dataSource.getRepository(Ad), "createQueryBuilder")
      .mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(expensiveAds),
        getCount: jest.fn().mockResolvedValue(expensiveAds.length),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: andWhereSpy,
      } as any);

    const result = await adQueries.getAllAds(
      undefined, // skillId
      mangoAmountMin // mangoAmountMin
    );

    expect(result.ads.length).toBe(expensiveAds.length);
    expect(result.ads).toEqual(expensiveAds);
    expect(result.adsCount).toBe(5);
    expect(andWhereSpy).toHaveBeenCalledWith(
      "ad.mangoAmount >= :mangoAmountMin",
      { mangoAmountMin: 3 }
    );
  });

  it("should filter ads by mangoAmountmax when mangoAmountmax argument is provided", async () => {
    cheapAds = createCheapMockAds(3);
    expensiveAds = createExpensiveMockAds(5);
    const mangoAmountMax = 3; //We expect to get only the cheap ads

    const andWhereSpy = jest.fn().mockReturnThis();

    jest
      .spyOn(dataSource.getRepository(Ad), "createQueryBuilder")
      .mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(cheapAds),
        getCount: jest.fn().mockResolvedValue(cheapAds.length),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: andWhereSpy,
      } as any);

    const result = await adQueries.getAllAds(
      undefined, // skillId
      undefined, // mangoAmountMin
      mangoAmountMax // mangoAmountMax
    );

    expect(result.ads.length).toBe(cheapAds.length);
    expect(result.ads).toEqual(cheapAds);
    expect(result.adsCount).toBe(3);
    expect(andWhereSpy).toHaveBeenCalledWith(
      "ad.mangoAmount <= :mangoAmountMax",
      {
        mangoAmountMax: 3,
      }
    );
  });

  it("should return ads 16 to 30 ads when the second page is requested and the default limit is not modified", async () => {
    ads = createMockAds(30);
    const page = 2;

    const skipSpy = jest.fn().mockReturnThis();
    const takeSpy = jest.fn().mockReturnThis();

    jest
      .spyOn(dataSource.getRepository(Ad), "createQueryBuilder")
      .mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        skip: skipSpy,
        take: takeSpy,
        getMany: jest.fn().mockResolvedValue(ads.slice(15, 30)),
        getCount: jest.fn().mockResolvedValue(ads.length),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
      } as any);

    const result = await adQueries.getAllAds(
      undefined, // skillId
      undefined, // mangoAmountMin
      undefined, // mangoAmountMax
      undefined, // durationMin
      undefined, // durationMax
      undefined, // status
      undefined, // maxDistance
      undefined, // userLatitude
      undefined, // userLongitude
      page // page
    );

    expect(result.ads.length).toBe(15);
    expect(result.ads).toEqual(ads.slice(15, 30));
    expect(result.adsCount).toBe(30);
    expect(skipSpy).toHaveBeenCalledWith(15); // page 2 → skip 15 (15 * (page - 1))
    expect(takeSpy).toHaveBeenCalledWith(15); // default limit
  });

  it("should return the right number of ads when the limit argument is provided", async () => {
    ads = createMockAds(30);
    const limit = 20;

    const skipSpy = jest.fn().mockReturnThis();
    const takeSpy = jest.fn().mockReturnThis();

    jest
      .spyOn(dataSource.getRepository(Ad), "createQueryBuilder")
      .mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        skip: skipSpy,
        take: takeSpy,
        getMany: jest.fn().mockResolvedValue(ads.slice(0, 20)),
        getCount: jest.fn().mockResolvedValue(ads.length),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
      } as any);

    const result = await adQueries.getAllAds(
      undefined, // skillId
      undefined, // mangoAmountMin
      undefined, // mangoAmountMax
      undefined, // durationMin
      undefined, // durationMax
      undefined, // status
      undefined, // maxDistance
      undefined, // userLatitude
      undefined, // userLongitude
      undefined, // page
      limit // limit
    );

    expect(result.ads.length).toBe(limit);
    expect(result.ads).toEqual(ads.slice(0, limit));
    expect(result.adsCount).toBe(30);
    expect(skipSpy).toHaveBeenCalledWith(0); // default page is 1
    expect(takeSpy).toHaveBeenCalledWith(limit);
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

  it("should return the correct ad when the id is valid", async () => {
    const adId = ads[0].id;
    if (!adId) {
      throw new Error("adId is undefined");
    }
    mockTypeOrm().onMock(Ad).toReturn(ads[0], "findOne");
    const retrievedAd = await adQueries.getAdById(adId);
    expect(retrievedAd).toEqual(ads[0]);
  });

  it("should return an error when the id is not valid", async () => {
    const invalidId = "999";
    if (!invalidId) {
      throw new Error("adId is undefined");
    }
    mockTypeOrm().onMock(Ad).toReturn(null, "findOne");
    await expect(adQueries.getAdById(invalidId)).rejects.toThrow(
      `Annonce non trouvée pour l'id ${invalidId}`
    );
  });
});

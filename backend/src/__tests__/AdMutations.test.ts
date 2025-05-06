import { mockTypeOrm } from "../tests_mockTypeorm-config";
import { faker } from "@faker-js/faker";
import { Ad, Status } from "../entities/Ad";
import { AdMutations } from "../resolvers/AdMutations";
import { Skill } from "../entities/Skill";
import { User } from "../entities/User";
import { Chat } from "../entities/Chat";
import { dataSource } from "../datasource";

describe("deleteAd", () => {
  let adMutations: AdMutations;
  let ad: Ad;
  let userRequester: User;
  let userHelper: User;
  let skill: Skill;
  let chat: Chat;

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

    chat = new Chat(false, userHelper, userRequester, ad);
    chat.id = faker.string.uuid();

    ad.chats = Promise.resolve([chat]);
  });

  it("should throw an error if ad does not exist", async () => {
    mockTypeOrm().onMock(Ad).toReturn(null, "findOne");

    await expect(
      adMutations.deleteAd(ad.id!, userRequester.id!)
    ).rejects.toThrow("Ad not found");
  });

  it("should throw an error if user is not the ad's userRequester", async () => {
    ad.userRequester = { id: "another-user-id" } as User;
    mockTypeOrm().onMock(Ad).toReturn(ad, "findOne");

    await expect(
      adMutations.deleteAd(ad.id!, userRequester.id!)
    ).rejects.toThrow("User not allowed to delete the ad");
  });

  it("should throw an error if ad's status is finalised", async () => {
    ad.status = Status.FINALISED;
    mockTypeOrm().onMock(Ad).toReturn(ad, "findOne");

    await expect(
      adMutations.deleteAd(ad.id!, userRequester.id!)
    ).rejects.toThrow(
      "Ad cannot be deleted as the service has already been provided"
    );
  });

  it("should throw an error if ad's status is isreviewed", async () => {
    ad.status = Status.ISREVIEWED;
    mockTypeOrm().onMock(Ad).toReturn(ad, "findOne");

    await expect(
      adMutations.deleteAd(ad.id!, userRequester.id!)
    ).rejects.toThrow(
      "Ad cannot be deleted as the service has already been provided"
    );
  });

  it("should delete ad and nullify related chats' ad references", async () => {
    const mockManager = {
      findOne: jest.fn().mockResolvedValue(ad),
      save: jest.fn().mockResolvedValue(chat),
      remove: jest.fn().mockResolvedValue(true),
    };

    jest
      .spyOn(dataSource, "transaction")
      .mockImplementation(async (cb: any) => {
        return cb(mockManager);
      });

    const result = await adMutations.deleteAd(ad.id!, userRequester.id!);

    expect(mockManager.findOne).toHaveBeenCalledWith(Ad, {
      where: { id: ad.id },
    });
    expect(mockManager.save).toHaveBeenCalledWith(
      expect.objectContaining({ ad: null })
    );
    expect(mockManager.remove).toHaveBeenCalledWith(ad);
    expect(chat.ad).toBeNull();
    expect(result).toBe(true);
  });

  it("should throw an error if deletion fails", async () => {
    const mockManager = {
      findOne: jest.fn().mockResolvedValue(ad),
      save: jest.fn().mockResolvedValue(chat),
      remove: jest.fn().mockRejectedValue(new Error("DB error")),
    };

    jest
      .spyOn(dataSource, "transaction")
      .mockImplementation(async (cb: any) => cb(mockManager));

    jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      adMutations.deleteAd(ad.id!, userRequester.id!)
    ).rejects.toThrow("Erreur lors de la suppression de l'annonce");
  });
});

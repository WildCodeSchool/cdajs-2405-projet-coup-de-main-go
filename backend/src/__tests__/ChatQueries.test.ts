import { Skill } from "../entities/Skill";
import { MockTypeORM } from "mock-typeorm";
import { faker } from "@faker-js/faker";
import { ChatQueries } from "../resolvers/ChatQueries";
import { User } from "../entities/User";
import { Chat } from "../entities/Chat";
import { Ad } from "../entities/Ad";

describe("getChatsByUserId", () => {
  let chatQueries: ChatQueries;
  let typeorm: MockTypeORM;
  let userRequester: User;
  let userHelper: User;
  let skill: Skill;
  let ad: Ad;

  beforeAll(() => {
    typeorm = new MockTypeORM();

    chatQueries = new ChatQueries();

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
  });

  const createMockChats = (count: number): Chat[] => {
    return Array.from({ length: count }, () => new Chat(userRequester, userHelper, ad));
  };

  it("should return two chats for user requester", async () => {
    const mockChats = createMockChats(2);
    typeorm.onMock(Chat).toReturn(mockChats, "find");

    const chatsRetrieved = await chatQueries.getChatsByUserId(userRequester.id!);

    expect(chatsRetrieved).toHaveLength(2);
  });

  it("should return two chats for user helper", async () => {
    const mockChats = createMockChats(2);
    typeorm.onMock(Chat).toReturn(mockChats, "find");

    const chatsRetrieved = await chatQueries.getChatsByUserId(userHelper.id!);

    expect(chatsRetrieved).toHaveLength(2);
  });

  it("should return the correct chats", async () => {
    const mockChats = createMockChats(2);
    typeorm.onMock(Chat).toReturn(mockChats, "find");

    const chatsRetrieved = await chatQueries.getChatsByUserId(userRequester.id!);

    expect(chatsRetrieved).toEqual(mockChats);
  });

  it("should throw an error if the user does not exist", async () => {
    typeorm.onMock(User).toReturn(null, "findOne");

    try {
      await chatQueries.getChatsByUserId(userRequester.id!);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      if (error instanceof Error) {
        expect(error.message).toBe("L'utilisateur spécifié n'existe pas.");
      }
    }
  });

  it("should return an empty array if the user has no chats", async () => {
    typeorm.onMock(User).toReturn(userRequester, "findOne");
    typeorm.onMock(Chat).toReturn([], "find");

    const chatsRetrieved = await chatQueries.getChatsByUserId(userRequester.id!);

    expect(chatsRetrieved).toEqual([]);
  });
});

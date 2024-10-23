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
  let user: User;
  let skill: Skill;
  let ad: Ad;

  beforeAll(() => {
    typeorm = new MockTypeORM();

    chatQueries = new ChatQueries();

    ad = new Ad(
      faker.lorem.word(),
      faker.lorem.sentence(),
      faker.location.streetAddress(),
      faker.location.zipCode(),
      faker.location.city(),
      faker.number.int(),
      faker.number.int(),
      user,
      skill
    );

    user = new User(
      faker.person.firstName(),
      faker.person.lastName(),
      faker.internet.email(),
      faker.internet.password(),
      faker.image.avatar(),
      faker.location.streetAddress(),
      faker.location.zipCode(),
      faker.location.city()
    );
    user.id = faker.string.uuid();

    skill = new Skill(faker.lorem.word(), faker.image.url());
  });

  const createMockChats = (count: number): Chat[] => {
    return Array.from({ length: count }, () => new Chat(user, user, ad));
  };

  it("should return two chats", async () => {
    const mockChats = createMockChats(2);
    typeorm.onMock(Chat).toReturn(mockChats, "find");

    const chatsRetrieved = await chatQueries.getChatsByUserId(user.id!);

    expect(chatsRetrieved).toHaveLength(2);
  });

  it("should return the correct chats", async () => {
    const mockChats = createMockChats(2);
    typeorm.onMock(Chat).toReturn(mockChats, "find");

    const chatsRetrieved = await chatQueries.getChatsByUserId(user.id!);

    expect(chatsRetrieved).toEqual(mockChats);
  });

  it("should throw an error if the user does not exist", async () => {
    typeorm.onMock(User).toReturn(null, "findOne");

    try {
      await chatQueries.getChatsByUserId(user.id!);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      if (error instanceof Error) {
        expect(error.message).toBe("L'utilisateur spécifié n'existe pas.");
      }
    }
  });

  it("should return an empty array if the user has no chats", async () => {
    typeorm.onMock(User).toReturn(user, "findOne");
    typeorm.onMock(Chat).toReturn([], "find");

    const chatsRetrieved = await chatQueries.getChatsByUserId(user.id!);

    expect(chatsRetrieved).toEqual([]);
  });
});

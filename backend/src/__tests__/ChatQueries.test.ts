import { ChatQueries } from "../resolvers/ChatQueries";
import { Chat } from "../entities/Chat";
import { User } from "../entities/User";
import { MockTypeORM } from "mock-typeorm";
import { faker } from "@faker-js/faker";

describe("ChatQueries", () => {
  let chatQueries: ChatQueries;
  let typeorm: MockTypeORM;

  beforeAll(() => {
    typeorm = new MockTypeORM();
    chatQueries = new ChatQueries();
  });

  const createMockChat = (count: number): Chat[] => {
    return Array.from({ length: count }, () => new Chat(faker.date.past()));
  };

  it("should return correct chats length", async () => {
    const mockChats = createMockChat(2);
    
    typeorm.onMock(Chat).toReturn(Promise.resolve(mockChats), "find");

    const chatsRetrieved = await chatQueries.getChatsByUserId(faker.string.uuid());

    expect(chatsRetrieved).toHaveLength(2);
  });

  it("should return the correct chats", async () => {
    const mockChats = createMockChat(2);
    typeorm.onMock(Chat).toReturn(Promise.resolve(mockChats), "find");

    const chatsRetrieved = await chatQueries.getChatsByUserId(faker.string.uuid());

    expect(chatsRetrieved).toEqual(mockChats);
  });

  it("should throw an error if the user does not exist", async () => {
    typeorm.onMock(User).toReturn(Promise.resolve(null), "findOne");

    await expect(chatQueries.getChatsByUserId(faker.string.uuid())).rejects.toThrow(
      "L'utilisateur spécifié n'existe pas."
    );
  });

  it("should return an empty array if no chats are found for the user", async () => {
    const mockUser = new User(
      faker.person.firstName(),
      faker.person.lastName(),
      faker.internet.email(),
      faker.internet.password(),
      faker.image.avatar(),
      faker.location.streetAddress(),
      faker.location.zipCode(),
      faker.location.city(),
    );

    typeorm.onMock(User).toReturn(Promise.resolve(mockUser), "findOne");

    typeorm.onMock(Chat).toReturn(Promise.resolve([]), "find");

    const chatsRetrieved = await chatQueries.getChatsByUserId(faker.string.uuid());

    expect(chatsRetrieved).toEqual([]);
});

});

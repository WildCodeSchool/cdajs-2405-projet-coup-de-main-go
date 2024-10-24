import { MockTypeORM } from "mock-typeorm";
import { faker } from "@faker-js/faker";
import { MessageQueries } from "../resolvers/MessageQueries";
import { Chat } from "../entities/Chat";
import { Message } from "../entities/Message";
import { User } from "../entities/User";
import { Ad } from "../entities/Ad";
import { Skill } from "../entities/Skill";

describe("getMessagesByChatId", () => {
  let messageQueries: MessageQueries;
  let typeorm: MockTypeORM;
  let userRequester: User;
  let userHelper: User;
  let chat: Chat;
  let ad: Ad;
  let skill: Skill;

  beforeAll(() => {
    typeorm = new MockTypeORM();
  });

  beforeEach(() => {
    messageQueries = new MessageQueries();

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

    chat = new Chat(userHelper, userRequester, ad);
    chat.id = faker.string.uuid();
  });

  afterEach(() => {
    typeorm.resetAll();
  });

  const createMockMessages = (count: number): Message[] => {
    return Array.from({ length: count }, () => {
      const message = new Message(
        faker.lorem.sentence(),
        faker.datatype.boolean(),
        chat,
        userHelper
      );
      return message;
    });
  };

  it("should return messages for the given chat ID", async () => {
    const mockMessages = createMockMessages(3);
    typeorm.onMock(Chat).toReturn(chat, "findOne");
    typeorm.onMock(Message).toReturn(mockMessages, "find");

    const messagesRetrieved = await messageQueries.getMessagesByChatId(
      chat.id!
    );

    expect(messagesRetrieved).toHaveLength(3);
    expect(messagesRetrieved).toEqual(mockMessages);
  });

  it("should throw an error if the chat does not exist", async () => {
    typeorm.onMock(Chat).toReturn(null, "findOne");

    await expect(messageQueries.getMessagesByChatId(chat.id!)).rejects.toThrow(
      "Le chat spécifié n'existe pas."
    );
  });

  it("should return an empty array if the chat has no messages", async () => {
    typeorm.onMock(Chat).toReturn(chat, "findOne");
    typeorm.onMock(Message).toReturn([], "find");

    const messagesRetrieved = await messageQueries.getMessagesByChatId(
      chat.id!
    );

    expect(messagesRetrieved).toEqual([]);
  });
});

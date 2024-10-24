import { MessageMutations, MessageInput } from "../resolvers/MessageMutations";
import { MockTypeORM } from "mock-typeorm";
import { faker } from "@faker-js/faker";
import { User } from "../entities/User";
import { Chat } from "../entities/Chat";
import { Message } from "../entities/Message";
import { Skill } from "../entities/Skill";
import { Ad } from "../entities/Ad";

describe("sendMessage", () => {
  let messageMutations: MessageMutations;
  let typeorm: MockTypeORM;
  let userRequester: User;
  let userHelper: User;
  let chat: Chat;
  let ad: Ad;
  let skill: Skill;
  let messageData: MessageInput;

  beforeAll(() => {
    typeorm = new MockTypeORM();
  });

  beforeEach(() => {
    messageMutations = new MessageMutations();

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

    chat = new Chat(userRequester, userHelper, ad);
    chat.id = faker.string.uuid();

    messageData = {
      message: faker.lorem.sentence(),
      isView: faker.datatype.boolean(),
      chatId: chat.id!,
      authorId: userHelper.id!,
    };
  });

  afterEach(() => {
    typeorm.resetAll();
  });

  it("should successfully send a message", async () => {
    typeorm.onMock(Chat).toReturn(chat, "findOne");
    typeorm.onMock(User).toReturn(userHelper, "findOne");
    typeorm.onMock(Message).toReturn(null, "save");

    const message = await messageMutations.sendMessage(messageData);

    expect(message).toBeInstanceOf(Message);
    expect(message.message).toBe(messageData.message);
    expect(message.chat.id).toBe(chat.id);
    expect(message.author.id).toBe(userHelper.id);
  });

  it("should throw an error if the chat does not exist", async () => {
    typeorm.onMock(Chat).toReturn(null, "findOne");

    await expect(messageMutations.sendMessage(messageData)).rejects.toThrow(
      "Le chat spécifié n'existe pas."
    );
  });

  it("should throw an error if the author does not exist", async () => {
    typeorm.onMock(Chat).toReturn(chat, "findOne");
    typeorm.onMock(User).toReturn(null, "findOne");

    await expect(messageMutations.sendMessage(messageData)).rejects.toThrow(
      "L'utilisateur spécifié n'existe pas."
    );
  });

  it("should throw an error if the author is not part of the chat", async () => {
    const wrongUser = new User(
      faker.person.firstName(),
      faker.person.lastName(),
      faker.internet.email(),
      faker.internet.password(),
      faker.image.avatar(),
      faker.location.streetAddress(),
      faker.location.zipCode(),
      faker.location.city()
    );

    typeorm.onMock(Chat).toReturn(chat, "findOne");
    typeorm.onMock(User).toReturn(wrongUser, "findOne");

    await expect(messageMutations.sendMessage(messageData)).rejects.toThrow(
      "L'utilisateur spécifié ne fait pas partie du chat spécifié."
    );
  });
});

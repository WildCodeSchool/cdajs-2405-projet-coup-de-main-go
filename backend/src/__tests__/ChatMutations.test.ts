import { ChatInput, ChatMutations } from "../resolvers/ChatMutations";
import { mockTypeOrm } from "../tests_mockTypeorm-config";
import { faker } from "@faker-js/faker";
import { User } from "../entities/User";
import { Chat } from "../entities/Chat";
import { Ad } from "../entities/Ad";
import { Skill } from "../entities/Skill";
import { Message } from "../entities/Message";

describe("createChat", () => {
  let chatMutations: ChatMutations;
  let userRequester: User;
  let userHelper: User;
  let ad: Ad;
  let skill: Skill;
  let messages: Message[];
  let chatData: ChatInput;

  beforeEach(() => {
    chatMutations = new ChatMutations();

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

    chatData = {
      adId: ad.id!,
      userRequesterId: userRequester.id!,
      userHelperId: userHelper.id!,
    };
  });

  it("should successfully create a chat", async () => {
    mockTypeOrm().onMock(User).toReturn(userRequester, "findOne");
    mockTypeOrm().onMock(User).toReturn(userHelper, "findOne");
    mockTypeOrm().onMock(Ad).toReturn(ad, "findOne");
    mockTypeOrm().onMock(Chat).toReturn(null, "findOne");
    mockTypeOrm().onMock(Chat).toReturn(null, "save");

    const chat = await chatMutations.createChat(chatData);
    expect(chat).toBeInstanceOf(Chat);
    expect(chat.userRequester.id).toBe(userRequester.id);
    expect(chat.userHelper.id).toBe(userHelper.id);
  });

  it("should throw an error if requester and helper are the same", async () => {
    const chatData: ChatInput = {
      adId: ad.id!,
      userRequesterId: userRequester.id!,
      userHelperId: userRequester.id!,
    };

    await expect(chatMutations.createChat(chatData)).rejects.toThrow(
      "Le requester et le helper ne peuvent pas être la même personne."
    );
  });

  it("should throw an error if requester does not exist", async () => {
    mockTypeOrm().onMock(User).toReturn(null, "findOne");

    await expect(chatMutations.createChat(chatData)).rejects.toThrow(
      "L'utilisateur requester spécifié n'existe pas."
    );
  });

  it("should throw an error if the ad does not exist or does not belong to the requester", async () => {
    mockTypeOrm().onMock(User).toReturn(userRequester, "findOne");
    mockTypeOrm().onMock(User).toReturn(userHelper, "findOne");
    mockTypeOrm().onMock(Ad).toReturn(null, "findOne");

    await expect(chatMutations.createChat(chatData)).rejects.toThrow(
      "L'annonce spécifiée n'existe pas ou n'appartient pas à l'utilisateur requester."
    );
  });

  it("should throw an error if a chat already exists", async () => {
    mockTypeOrm().onMock(User).toReturn(userRequester, "findOne");
    mockTypeOrm().onMock(User).toReturn(userHelper, "findOne");
    mockTypeOrm().onMock(Ad).toReturn(ad, "findOne");
    mockTypeOrm()
      .onMock(Chat)
      .toReturn(
        new Chat(faker.datatype.boolean(), userRequester, userHelper, ad),
        "findOne"
      );

    await expect(chatMutations.createChat(chatData)).rejects.toThrow(
      "Un chat existe déjà pour cette annonce entre ces deux utilisateurs."
    );
  });
});

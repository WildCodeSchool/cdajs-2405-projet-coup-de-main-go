import { MessageMutations, MessageInput } from "../resolvers/MessageMutations";
import { mockTypeOrm } from "../tests_mockTypeorm-config";
import { faker } from "@faker-js/faker";
import { User } from "../entities/User";
import { Chat } from "../entities/Chat";
import { Message } from "../entities/Message";
import { Skill } from "../entities/Skill";
import { Ad } from "../entities/Ad";

describe("sendMessage", () => {
    let messageMutations: MessageMutations;
    let userRequester: User;
    let userHelper: User;
    let chat: Chat;
    let ad: Ad;
    let skill: Skill;
    let messageData: MessageInput;

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
            isViewedByRequester: faker.datatype.boolean(),
            isViewedByHelper: faker.datatype.boolean(),
            chatId: chat.id!,
            authorId: userHelper.id!,
        };
    });

    it("should successfully send a message", async () => {
        mockTypeOrm().onMock(Chat).toReturn(chat, "findOne");
        mockTypeOrm().onMock(User).toReturn(userHelper, "findOne");
        mockTypeOrm().onMock(Message).toReturn(null, "save");

        const message = await messageMutations.sendMessage(messageData);

        expect(message).toBeInstanceOf(Message);
        expect(message.message).toBe(messageData.message);
        expect(message.chat.id).toBe(chat.id);
        expect(message.author.id).toBe(userHelper.id);
    });

    it("should throw an error if the chat does not exist", async () => {
        mockTypeOrm().onMock(Chat).toReturn(null, "findOne");

        await expect(messageMutations.sendMessage(messageData)).rejects.toThrow(
            "Le chat spécifié n'existe pas."
        );
    });

    it("should throw an error if the author does not exist", async () => {
        mockTypeOrm().onMock(Chat).toReturn(chat, "findOne");
        mockTypeOrm().onMock(User).toReturn(null, "findOne");

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

        mockTypeOrm().onMock(Chat).toReturn(chat, "findOne");
        mockTypeOrm().onMock(User).toReturn(wrongUser, "findOne");

        await expect(messageMutations.sendMessage(messageData)).rejects.toThrow(
            "L'utilisateur spécifié ne fait pas partie du chat spécifié."
        );
    });
});

describe("markMessagesAsReadForUser", () => {
    let messageMutations: MessageMutations;
    let userRequester: User;
    let userHelper: User;
    let chat: Chat;
    let ad: Ad;
    let skill: Skill;

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
    });

    it("should mark messages as read for the requester", async () => {
        mockTypeOrm().onMock(Chat).toReturn(chat, "findOne");
        mockTypeOrm().onMock(Message).toReturn(null, "update");

        const result = await messageMutations.markMessagesAsReadForUser(
            chat.id!,
            userRequester.id!
        );

        expect(result).toBe(true);
    });

    it("should mark messages as read for the helper", async () => {
        mockTypeOrm().onMock(Chat).toReturn(chat, "findOne");
        mockTypeOrm().onMock(Message).toReturn(null, "update");

        const result = await messageMutations.markMessagesAsReadForUser(
            chat.id!,
            userHelper.id!
        );

        expect(result).toBe(true);
    });

    it("should throw an error if the chat does not exist", async () => {
        mockTypeOrm().onMock(Chat).toReturn(null, "findOne");

        await expect(
            messageMutations.markMessagesAsReadForUser(chat.id!, userRequester.id!)
        ).rejects.toThrow("Le chat spécifié n'existe pas.");
    });

    it("should throw an error if the user is not part of the chat", async () => {
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
        wrongUser.id = faker.string.uuid();

        mockTypeOrm().onMock(Chat).toReturn(chat, "findOne");

        await expect(
            messageMutations.markMessagesAsReadForUser(chat.id!, wrongUser.id!)
        ).rejects.toThrow("L'utilisateur spécifié ne fait pas partie du chat.");
    });
});

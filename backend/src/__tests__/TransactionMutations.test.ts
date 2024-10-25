import { TransactionMutations, TransactionInput } from "../resolvers/TransactionMutations";
import { mockTypeOrm } from "../tests_mockTypeorm-config";
import { faker } from "@faker-js/faker";
import { User } from "../entities/User";
import { Ad } from "../entities/Ad";
import { Transaction } from "../entities/Transaction";
import { Skill } from "../entities/Skill";

describe("addTransaction", () => {
    let transactionMutations: TransactionMutations;
    let userRequester: User;
    let userHelper: User;
    let ad: Ad;
    let skill: Skill;
    let transactionData: TransactionInput;

    beforeEach(() => {
        transactionMutations = new TransactionMutations();

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

        transactionData = {
            adId: ad.id,
            userHelperId: userHelper.id,
            userRequesterId: userRequester.id
        };
    });

    it("should successfully add a transaction", async () => {
        mockTypeOrm().onMock(Transaction).toReturn(null, "findOne");
        mockTypeOrm().onMock(Ad).toReturn(ad, "findOne");
        mockTypeOrm().onMock(User).toReturn(userRequester, "findOne").toReturn(userHelper, "findOne");
        mockTypeOrm().onMock(Transaction).toReturn(null, "findOne").toReturn(null, "save");

        const transaction = await transactionMutations.addTransaction(transactionData);

        expect(transaction).toBeInstanceOf(Transaction);
        expect(transaction.ad.id).toBe(ad.id);
        expect(transaction.userRequester.id).toBe(userRequester.id);
        expect(transaction.userHelper.id).toBe(userHelper.id);
    });

    it("should throw an error if the requester and helper are the same", async () => {
        transactionData.userHelperId = userRequester.id!;

        await expect(transactionMutations.addTransaction(transactionData)).rejects.toThrow(
            "L'utilisateur demandeur ne peut pas être le même que l'utilisateur aide."
        );
    });

    it("should throw an error if the ad already has a transaction", async () => {
        mockTypeOrm().onMock(Transaction).toReturn(transactionData, "findOne");

        await expect(transactionMutations.addTransaction(transactionData)).rejects.toThrow(
            "L'annonce spécifiée a déjà une transaction associée."
        );
    });

    it("should throw an error if the ad does not exist", async () => {
        mockTypeOrm().onMock(Transaction).toReturn(null, "findOne");
        mockTypeOrm().onMock(Ad).toReturn(null, "findOne");

        await expect(transactionMutations.addTransaction(transactionData)).rejects.toThrow(
            "L'annonce spécifiée n'existe pas."
        );
    });

    it("should throw an error if the requester user does not exist", async () => {
        mockTypeOrm().onMock(Transaction).toReturn(null, "findOne");
        mockTypeOrm().onMock(Ad).toReturn(ad, "findOne");
        mockTypeOrm().onMock(User).toReturn(null, "findOne");

        await expect(transactionMutations.addTransaction(transactionData)).rejects.toThrow(
            "L'utilisateur requester spécifié n'existe pas."
        );
    });

    it("should throw an error if the helper user does not exist", async () => {
        mockTypeOrm().onMock(Transaction).toReturn(null, "findOne");
        mockTypeOrm().onMock(Ad).toReturn(ad, "findOne");
        mockTypeOrm().onMock(User).toReturn(userRequester, "findOne").toReturn(false, "findOne");

        await expect(transactionMutations.addTransaction(transactionData)).rejects.toThrow(
            "L'utilisateur helper spécifié n'existe pas."
        );
    });

    it("should throw an error if the requester is not the owner of the ad", async () => {
        ad.userRequester!.id = faker.string.uuid();

        mockTypeOrm().onMock(Transaction).toReturn(null, "findOne");
        mockTypeOrm().onMock(Ad).toReturn(ad, "findOne");
        mockTypeOrm().onMock(User).toReturn(userRequester, "findOne").toReturn(userHelper, "findOne"); 

        await expect(transactionMutations.addTransaction(transactionData)).rejects.toThrow(
            "L'utilisateur demandeur n'est pas le propriétaire de l'annonce spécifiée."
        );
    });
});

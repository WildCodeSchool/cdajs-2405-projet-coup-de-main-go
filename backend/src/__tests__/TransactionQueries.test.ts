import { TransactionQueries } from "../resolvers/TransactionQueries";
import { mockTypeOrm } from "../tests_mockTypeorm-config";
import { faker } from "@faker-js/faker";
import { User } from "../entities/User";
import { Transaction } from "../entities/Transaction";
import { Ad } from "../entities/Ad";
import { Skill } from "../entities/Skill";

describe("getTransactionsByUser", () => {
  let transactionQueries: TransactionQueries;
  let userRequester: User;
  let userHelper: User;
  let ad: Ad;
  let skill: Skill;

  beforeEach(() => {
    transactionQueries = new TransactionQueries();

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
      faker.number.int({ min: 1, max: 10 }),
      faker.number.int({ min: 10, max: 100 }),
      userRequester, 
      skill 
    );
    ad.id = faker.string.uuid();
  });

  // Fonction pour créer des transactions simulées
  const createMockTransactions = (count: number): Transaction[] => {
    return Array.from({ length: count }, () => new Transaction(ad, userHelper, userRequester));
  };

  it("should return transactions history for user requester", async () => {
    const mockTransactions = createMockTransactions(2);
    mockTypeOrm().onMock(Transaction).toReturn(mockTransactions, "find");

    const transactionsRetrieved = await transactionQueries.getTransactionsHistoryByUser(userRequester.id!);

    expect(transactionsRetrieved).toHaveLength(2);
  });

  it("should return transactions history for user helper", async () => {
    const mockTransactions = createMockTransactions(2);
    mockTypeOrm().onMock(Transaction).toReturn(mockTransactions, "find");

    const transactionsRetrieved = await transactionQueries.getTransactionsHistoryByUser(userHelper.id!);

    expect(transactionsRetrieved).toHaveLength(2);
  });

  it("should return the correct transactions", async () => {
    const mockTransactions = createMockTransactions(2);
    mockTypeOrm().onMock(Transaction).toReturn(mockTransactions, "find");

    const transactionsRetrieved = await transactionQueries.getTransactionsHistoryByUser(userRequester.id!);

    expect(transactionsRetrieved).toEqual(mockTransactions);
  });

  it("should throw an error if the user does not exist", async () => {
    mockTypeOrm().onMock(User).toReturn(null, "findOne");

    try {
      await transactionQueries.getTransactionsHistoryByUser(userRequester.id!);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      if (error instanceof Error) {
        expect(error.message).toBe("L'utilisateur spécifié n'existe pas.");
      }
    }
  });

  it("should return an empty array if the user has no transactions", async () => {
    mockTypeOrm().onMock(User).toReturn(userRequester, "findOne");
    mockTypeOrm().onMock(Transaction).toReturn([], "find");

    const transactionsRetrieved = await transactionQueries.getTransactionsHistoryByUser(userRequester.id!);

    expect(transactionsRetrieved).toEqual([]);
  });
});
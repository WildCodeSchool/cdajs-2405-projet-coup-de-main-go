jest.mock("../utils/cacheAds", () => ({
    invalidateAdsCache: jest.fn().mockResolvedValue(undefined),
}));

import { mockTypeOrm } from "../tests_mockTypeorm-config";
import { faker } from "@faker-js/faker";
import { Ad, Status } from "../entities/Ad";
import { AdMutations } from "../resolvers/AdMutations";
import { Skill } from "../entities/Skill";
import { User } from "../entities/User";
import { Chat } from "../entities/Chat";
import { invalidateAdsCache } from "../utils/cacheAds";

describe("deleteAd", () => {
    let adMutations: AdMutations;
    let ad: Ad;
    let userRequester: User;
    let userHelper: User;
    let skill: Skill;

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

        (invalidateAdsCache as jest.Mock).mockClear();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should throw an error if ad does not exist", async () => {
        mockTypeOrm().onMock(Ad).toReturn(null, "findOneBy");

        await expect(
            adMutations.deleteAd(ad.id!, userRequester.id!)
        ).rejects.toThrow("Ad not found");
    });

    it("should throw an error if user is not the ad's userRequester", async () => {
        ad.userRequester = { id: "another-user-id" } as User;
        mockTypeOrm().onMock(Ad).toReturn(ad, "findOneBy");

        await expect(
            adMutations.deleteAd(ad.id!, userRequester.id!)
        ).rejects.toThrow("User not allowed to delete the ad");
    });

    it("should throw an error if ad's status is finalised", async () => {
        ad.status = Status.FINALISED;
        mockTypeOrm().onMock(Ad).toReturn(ad, "findOneBy");

        await expect(
            adMutations.deleteAd(ad.id!, userRequester.id!)
        ).rejects.toThrow(
            "Ad cannot be deleted as the service has already been provided"
        );
    });

    it("should throw an error if ad's status is isreviewed", async () => {
        ad.status = Status.ISREVIEWED;
        mockTypeOrm().onMock(Ad).toReturn(ad, "findOneBy");

        await expect(
            adMutations.deleteAd(ad.id!, userRequester.id!)
        ).rejects.toThrow(
            "Ad cannot be deleted as the service has already been provided"
        );
    });

    it("should update ad status to DELETED and set deletedAt date", async () => {
        const testDate = new Date();
        jest.useFakeTimers().setSystemTime(testDate);

        mockTypeOrm().onMock(Ad).toReturn(ad, "findOneBy");
        ad.save = jest.fn().mockResolvedValue(ad);

        const result = await adMutations.deleteAd(ad.id!, userRequester.id!);

        expect(ad.status).toBe(Status.DELETED);
        expect(ad.deletedAt).toEqual(testDate);
        expect(ad.save).toHaveBeenCalled();
        expect(invalidateAdsCache).toHaveBeenCalled();
        expect(result).toBe(true);
    });

    it("should throw an error if updating fails", async () => {
        mockTypeOrm().onMock(Ad).toReturn(ad, "findOneBy");

        ad.save = jest.fn().mockRejectedValue(new Error("DB error"));

        jest.spyOn(console, "error").mockImplementation(() => {});

        await expect(
            adMutations.deleteAd(ad.id!, userRequester.id!)
        ).rejects.toThrow("Erreur lors de la suppression de l'annonce");
    });
});

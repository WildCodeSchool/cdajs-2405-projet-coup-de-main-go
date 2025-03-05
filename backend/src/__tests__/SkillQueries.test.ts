import { SkillQueries } from "../resolvers/SkillQueries";
import { Skill } from "../entities/Skill";
import { mockTypeOrm } from "../tests_mockTypeorm-config";
import { faker } from "@faker-js/faker";

describe("SkillQueries", () => {
    let skillQueries: SkillQueries;

    beforeAll(() => {
        skillQueries = new SkillQueries();
    });

    const createMockSkills = (count: number): Skill[] => {
        return Array.from(
            { length: count },
            () => new Skill(faker.word.adjective(), faker.image.url())
        );
    };

    it("should return two skills", async () => {
        const mockSkills = createMockSkills(2);
        mockTypeOrm().onMock(Skill).toReturn(mockSkills, "find");

        const skillsRetrieved = await skillQueries.getAllSkills();

        expect(skillsRetrieved).toHaveLength(2);
    });

    it("should return the correct skills", async () => {
        const mockSkills = createMockSkills(2);
        mockTypeOrm().onMock(Skill).toReturn(mockSkills, "find");

        const skillsRetrieved = await skillQueries.getAllSkills();

        expect(skillsRetrieved).toEqual(mockSkills);
    });

    it("should return an empty array if no skills are found", async () => {
        mockTypeOrm().onMock(Skill).toReturn([], "find");

        const skillsRetrieved = await skillQueries.getAllSkills();

        expect(skillsRetrieved).toEqual([]);
    });
});

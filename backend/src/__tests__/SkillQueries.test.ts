import { SkillQueries } from "../resolvers/SkillQueries";
import { Skill } from "../entities/Skill";
import { MockTypeORM } from "mock-typeorm";
import { faker } from "@faker-js/faker";

describe("SkillQueries", () => {
  let skillQueries: SkillQueries;
  let typeorm: MockTypeORM;

  beforeAll(() => {
    typeorm = new MockTypeORM();
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
    typeorm.onMock(Skill).toReturn(mockSkills, "find");

    const skillsRetrieved = await skillQueries.getAllSkills();

    expect(skillsRetrieved).toHaveLength(2);
  });

  it("should return the correct skills", async () => {
    const mockSkills = createMockSkills(2);
    typeorm.onMock(Skill).toReturn(mockSkills, "find");

    const skillsRetrieved = await skillQueries.getAllSkills();

    expect(skillsRetrieved).toEqual(mockSkills);
  });

  it("should return an empty array if no skills are found", async () => {
    typeorm.onMock(Skill).toReturn([], "find");

    const skillsRetrieved = await skillQueries.getAllSkills();

    expect(skillsRetrieved).toEqual([]);
  });
});

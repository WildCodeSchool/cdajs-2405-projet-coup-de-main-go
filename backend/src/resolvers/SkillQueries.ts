import { Resolver, Query } from "type-graphql";
import { Skill } from "../entities/Skill";
import { dataSource } from "../datasource";

@Resolver(Skill)
export class SkillQueries {
  @Query(() => [Skill], { nullable: true })
  async getAllSkills(): Promise<Skill[] | null> {
    const skills = await dataSource.manager.find(Skill);
    return skills;
  }
}

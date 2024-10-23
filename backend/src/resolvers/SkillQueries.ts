import { Resolver, Query } from "type-graphql";
import { Skill } from "../entities/Skill";

@Resolver(Skill)
export class SkillQueries {
  @Query(() => [Skill], { nullable: true })
  async getAllSkills(): Promise<Skill[] | null> {
    const skills = await Skill.find();
    return skills;
  }
}
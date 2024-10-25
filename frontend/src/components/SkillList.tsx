import {
  GetAllSkillsQuery,
  useGetAllSkillsQuery,
} from "../generated/graphql-types";
import type { Skill } from "../types";

export default function SkillList() {
  const { loading, error, data } = useGetAllSkillsQuery();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const result: GetAllSkillsQuery = data!;
  const skills: Skill[] = result.getAllSkills ? [...result.getAllSkills] : [];

  return (
    <div>
      <h2>Compétences</h2>
      <ul>
        {skills!.map((skill: Skill) => (
          <li key={skill.id}>
            <img src={skill.picture} alt={skill.name} width="50" height="50" />
            <p>{skill.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
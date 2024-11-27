import { Button, Input, MenuItem, Select } from "@mui/material";
import { useForm } from "react-hook-form";
import {
  AdInput,
  useCreateAdMutation,
  useGetAllSkillsQuery,
} from "../generated/graphql-types";
import type { Skill } from "../types";

export default function NewAd() {
  const { register, handleSubmit } = useForm<AdInput>();
  const {
    loading: skillsLoading,
    error: skillsError,
    data: skillsData,
  } = useGetAllSkillsQuery();
  const [createAdMutation, { data, loading, error }] = useCreateAdMutation();

  const skills: Skill[] = skillsData?.getAllSkills ?? [];

  const onFormSubmitted = async (formData: AdInput) => {
    console.log("data", formData);

    await createAdMutation({
      variables: {
        formData: {
          title: formData.title,
          description: formData.description,
          address: formData.address,
          zipCode: formData.zipCode,
          city: formData.city,
          duration: formData.duration,
          mangoAmount: formData.duration / 30,
          skillId: formData.skillId,
          userRequesterId: "1", // TODO: get the user id from the context
        },
      },
    });
  };

  return (
    <>
      <h1>Créer une annonce</h1>
      <form onSubmit={handleSubmit(onFormSubmitted)}>
        {/* Titre de l'annonce */}
        <Input
          type="text"
          {...register("title", { required: true })}
          placeholder="Titre de l'annonce"
        />
        {/* Description de l'annonce */}
        <Input
          type="text"
          {...register("description", { required: true })}
          placeholder="Description"
        />
        {/* Adresse de l'annonce */}
        <Input
          type="text"
          {...register("address", { required: true })}
          placeholder="Adresse"
        />
        <Input
          type="text"
          {...register("zipCode", { required: true })}
          placeholder="Code postal"
        />
        <Input
          type="text"
          {...register("city", { required: true })}
          placeholder="Ville"
        />
        {/* Durée de l'annonce */}
        <Input
          type="number"
          {...register("duration", { required: true, valueAsNumber: true })}
          placeholder="Durée"
        />
        {/* Compétence requise pour l'annonce */}
        <Select
          {...register("skillId", { required: true })}
          defaultValue=""
          displayEmpty
          disabled={skillsLoading || !!skillsError}
        >
          <MenuItem value="" disabled>
            {skillsLoading
              ? "Chargement des compétences..."
              : "Sélectionnez une compétence"}
          </MenuItem>
          {skillsError && (
            <MenuItem value="" disabled>
              Erreur de chargement des compétences
            </MenuItem>
          )}
          {skills.map((skill) => (
            <MenuItem key={skill.id} value={skill.id}>
              {skill.name}
            </MenuItem>
          ))}
        </Select>
        {/* Soumission de  l'annonce */}
        <Button type="submit">Envoyer</Button>
      </form>
      {loading && "Envoi en cours..."}
      {error && "Une erreur est survenue, merci de réessayer..."}
    </>
  );
}

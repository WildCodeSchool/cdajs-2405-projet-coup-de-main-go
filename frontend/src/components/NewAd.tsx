import {
  Button,
  Input,
  List,
  ListItem,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import {
  AdInput,
  useCreateAdMutation,
  useGetAllSkillsQuery,
} from "../generated/graphql-types";
import type { Skill } from "../types";
import { useState } from "react";

export default function NewAd() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AdInput>({ defaultValues: { title: "", description: "" } });

  const {
    loading: skillsLoading,
    error: skillsError,
    data: skillsData,
  } = useGetAllSkillsQuery();
  const [createAdMutation, { data, loading, error }] = useCreateAdMutation();

  const skills: Skill[] = skillsData?.getAllSkills ?? [];

  const [title, description] = watch("title", "description");

  // Autosuggestion de l'adresse
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [addressInput, setAddressInput] = useState<string>("");
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>("");

  const handleAddressChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setAddressInput(query);

    if (!query) {
      setAddressSuggestions([]);
      return;
    }

    if (query.length >= 3) {
      try {
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
            query
          )}&limit=5`
        );
        const data = await response.json();
        setAddressSuggestions(data.features || []);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des suggestions :",
          error
        );
      }
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSelectedSuggestion(suggestion);
    setAddressInput(suggestion.properties.label);
    setAddressSuggestions([]);
  };

  // Gestion de la soumission du formulaire
  const onFormSubmitted = async (formData: AdInput) => {
    console.log("data", formData);
    await createAdMutation({
      variables: {
        formData: {
          title: formData.title,
          description: formData.description,
          address: selectedSuggestion.properties.name,
          zipCode: selectedSuggestion.properties.postcode,
          city: selectedSuggestion.properties.city,
          latitude: selectedSuggestion.geometry.coordinates[1],
          longitude: selectedSuggestion.geometry.coordinates[0],
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
          {...register("title", {
            required: "Champ obligatoire",
            maxLength: {
              value: 50,
              message: "50 caractères maximum",
            },
          })}
          placeholder="Titre de l'annonce"
        />
        <Typography>
          {title?.length > 50 ? "50 caractères maximum" : errors.title?.message}
        </Typography>
        {/* Description de l'annonce */}
        <Input
          type="text"
          {...register("description", {
            required: "Champ obligatoire",
            maxLength: {
              value: 255,
              message: "255 caractères maximum",
            },
          })}
          placeholder="Description"
        />
        <Typography>
          {description?.length > 255
            ? "255 caractères maximum"
            : errors.description?.message}
        </Typography>
        {/* Adresse de l'annonce */}

        <Input
          type="text"
          value={addressInput}
          onChange={handleAddressChange}
          placeholder="Adresse"
        />
        {addressSuggestions.length > 0 && (
          <List>
            {addressSuggestions.map((suggestion: any) => (
              <ListItem
                key={suggestion.properties.id}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.properties.label}
              </ListItem>
            ))}
          </List>
        )}
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

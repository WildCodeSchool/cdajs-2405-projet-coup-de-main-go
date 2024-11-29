import {
  Autocomplete,
  Box,
  Button,
  Input,
  List,
  ListItem,
  MenuItem,
  Modal,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import {
  AdInput,
  useCreateAdMutation,
  useGetAllSkillsQuery,
} from "../generated/graphql-types";
import type { Skill } from "../types";
import { useState } from "react";
import React from "react";

export default function NewAd() {
  // TODO : à remplacer lorsque la navbar sera créé pour contrôler la visibilité de la modale
  const [isModalOpen, setIsModalOpen] = useState(true);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AdInput>({
    defaultValues: { title: "", description: "", duration: 0 },
  });

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
  const [addressError, setAddressError] = useState<string>("");

  const handleAddressChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setAddressInput(query);

    if (!query) {
      setAddressSuggestions([]);
      setAddressError("Veuillez entrer une adresse.");
      return;
    }

    if (query.length > 1) {
      setAddressError("");
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
        setAddressError("Erreur lors de la récupération des suggestions");
      }
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSelectedSuggestion(suggestion);
    console.log("selectedSuggestion", suggestion);
    setAddressInput(suggestion.properties.label);
    setAddressSuggestions([]);
    setAddressError("");
  };

  // Gestion de la soumission du formulaire
  const onFormSubmitted = async (formData: AdInput) => {
    if (!selectedSuggestion) {
      setAddressError("Veuillez sélectionner une adresse valide.");
      return;
    }

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
    <Modal
      open={isModalOpen}
      sx={{
        width: "60%",
        height: "80%",
        margin: "auto",
      }}
    >
      <Box>
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
            {title?.length > 50
              ? "50 caractères maximum"
              : errors.title?.message}
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
          {addressError && <Typography>{addressError}</Typography>}

          {/* Durée de l'annonce */}
          <Typography>Sélectionner une durée</Typography>
          <Controller
            name="duration"
            control={control}
            rules={{
              required: "Veuillez sélectionner une durée.",
              validate: (value) =>
                value > 0 || "Veuillez sélectionner une durée.",
            }}
            render={({ field }) => (
              <Slider
                {...field}
                valueLabelDisplay="auto"
                step={30}
                min={0}
                max={360}
                marks
                valueLabelFormat={(value) => {
                  const hours = Math.floor(value / 60);
                  const minutes = value % 60;
                  if (hours === 0) {
                    return `${minutes}min`;
                  } else if (minutes === 0) {
                    return `${hours}h`;
                  } else {
                    return `${hours}h ${minutes}min`;
                  }
                }}
              />
            )}
          />
          {errors.duration && (
            <Typography color="error" variant="body2">
              {errors.duration.message}
            </Typography>
          )}
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
      </Box>
    </Modal>
  );
}

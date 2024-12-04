import {
  Autocomplete,
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Modal,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import {
  AdInput,
  useCreateAdMutation,
  useGetAllSkillsQuery,
} from "../../generated/graphql-types";
import type { Skill } from "../../types";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import theme from "../../mui";

interface NewAdModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
}

export default function NewAdModal({
  isModalOpen,
  closeModal,
}: NewAdModalProps) {
  const isResponsiveLayout = useMediaQuery(theme.breakpoints.down("md"));
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
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>("");

  const fetchAddressSuggestions = async (query: string) => {
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

  // Gestion de la soumission du formulaire
  const onFormSubmitted = async (formData: AdInput) => {
    try {
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
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la création de l'annonce :", error);
    }
  };

  return (
    <Modal open={isModalOpen} onClose={closeModal}>
      <Box
        sx={{
          width: "70%",
          height: "77vh",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--background)",
          borderRadius: "20px",
          alignItems: "center",
        }}
      >
        {/* Top row */}
        <Stack
          direction="row"
          sx={{
            position: "relative",
            justifyContent: "center",
            backgroundColor: "pink",
          }}
        >
          <Typography variant="h3" component="h2">
            Créer une annonce
          </Typography>
          <IconButton
            aria-label="fermer"
            onClick={closeModal}
            sx={{
              position: "absolute",
              top: "8px",
              right: "8px",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmitted)}>
          <Stack
            direction={isResponsiveLayout ? "column" : "row"}
            sx={{ backgroundColor: "lightblue", margin: "50px" }}
          >
            {/* Left column */}
            <Stack
              sx={{
                width: {
                  xs: "100%",
                  md: "60%",
                },
              }}
            >
              {/* Titre de l'annonce */}
              <TextField
                type="text"
                label="Titre"
                {...register("title", {
                  required: "Champ obligatoire",
                  maxLength: {
                    value: 50,
                    message: "50 caractères maximum",
                  },
                })}
                placeholder="Titre de l'annonce"
                sx={{ backgroundColor: "#FFFFFF" }}
              />
              <Typography color="error">
                {title?.length > 50
                  ? "50 caractères maximum"
                  : errors.title?.message}
              </Typography>
              {/* Description de l'annonce */}
              <TextField
                type="text"
                label="Description"
                multiline
                maxRows={4}
                {...register("description", {
                  required: "Champ obligatoire",
                  maxLength: {
                    value: 255,
                    message: "255 caractères maximum",
                  },
                })}
                placeholder="Description"
                sx={{ backgroundColor: "white" }}
              />
              <Typography color="error">
                {description?.length > 255
                  ? "255 caractères maximum"
                  : errors.description?.message}
              </Typography>
              {/* Adresse de l'annonce */}
              <Controller
                name="address"
                control={control}
                rules={{
                  required: "Veuillez saisir une adresse.",
                }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={addressSuggestions}
                    getOptionLabel={(option: any) => option.properties.label}
                    onInputChange={(event, value) =>
                      fetchAddressSuggestions(value)
                    }
                    onChange={(event: any, value: string | null) => {
                      field.onChange(value);
                      setSelectedSuggestion(value);
                    }}
                    sx={{ backgroundColor: "white" }}
                    renderInput={(params) => (
                      <TextField {...params} label="Adresse" />
                    )}
                  />
                )}
              />

              {errors.address && (
                <Typography>{errors.address.message}</Typography>
              )}

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
                <Typography color="error">{errors.duration.message}</Typography>
              )}
            </Stack>
            {!isResponsiveLayout && (
              <Divider
                orientation="vertical"
                flexItem
                sx={{ margin: "0 50px" }}
              />
            )}

            {/* Right column */}
            <Stack
              sx={{
                width: {
                  xs: "100%",
                  md: "40%",
                },
              }}
            >
              {/* Compétence requise pour l'annonce */}
              <Typography>Ajouter des photos</Typography>
              <Select
                label="Catégorie"
                {...register("skillId", { required: "Champ obligatoire" })}
                defaultValue=""
                displayEmpty
                disabled={skillsLoading || !!skillsError}
              >
                <MenuItem value="" disabled>
                  {skillsLoading ? "Chargement des catégories..." : "Catégorie"}
                </MenuItem>
                {skillsError && (
                  <MenuItem value="" disabled>
                    Erreur de chargement des categories
                  </MenuItem>
                )}
                {skills.map((skill) => (
                  <MenuItem key={skill.id} value={skill.id}>
                    {skill.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.skillId && (
                <Typography color="error">{errors.skillId.message}</Typography>
              )}
            </Stack>
          </Stack>
          {/* Submit button */}
          <Stack sx={{ alignItems: "flex-end", backgroundColor: "yellow" }}>
            <Button type="submit">Envoyer</Button>
          </Stack>
        </form>

        {loading && "Envoi en cours..."}
        {error && "Une erreur est survenue, merci de réessayer..."}
      </Box>
    </Modal>
  );
}

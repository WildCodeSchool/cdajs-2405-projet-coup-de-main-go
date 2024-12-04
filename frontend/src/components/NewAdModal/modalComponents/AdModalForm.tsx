import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
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
} from "../../../generated/graphql-types";
import type { AddressSuggestion, Skill } from "../../../types";
import { useState } from "react";
import theme from "../../../mui";
import AdModalFormAddress from "./AdModalFormAddress";
import { CameraAlt } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

interface AdModalFormProps {
  closeModal: () => void;
}

export default function AdModalForm({ closeModal }: AdModalFormProps) {
  const isResponsiveLayout = useMediaQuery(theme.breakpoints.down("md"));
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AdInput>({
    defaultValues: { title: "", description: "", duration: 0 },
  });

  const {
    loading: skillsLoading,
    error: skillsError,
    data: skillsData,
  } = useGetAllSkillsQuery();
  const [createAdMutation, { loading, error }] = useCreateAdMutation();

  const skills: Skill[] = skillsData?.getAllSkills ?? [];

  const [title, description] = watch("title", "description");

  // Selection de l'adresse
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<AddressSuggestion | null>(null);

  // Gestion des images et de leur prévisualisation
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Mise à jour de la liste des fichiers
      const newFiles = [...files];
      newFiles[index] = selectedFile;
      setFiles(newFiles);
      // Mise à jour de la liste des URLs des fichiers
      const fileUrl = URL.createObjectURL(selectedFile);
      const newFileUrls = [...fileUrls];
      newFileUrls[index] = fileUrl;
      setFileUrls(newFileUrls);
    }
  };

  const handleDelete = (index: number) => {
    // Suppression du fichier
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    // Suppression de l'URL du fichier
    URL.revokeObjectURL(fileUrls[index]);
    const newFileUrls = [...fileUrls];
    newFileUrls.splice(index, 1);
    setFileUrls(newFileUrls);
  };

  // Gestion de la soumission du formulaire
  const onFormSubmitted = async (formData: AdInput) => {
    console.log("files", setFiles);
    if (!selectedSuggestion) {
      console.error("Aucune adresse sélectionnée");
      return;
    }

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
    <form onSubmit={handleSubmit(onFormSubmitted)}>
      <Stack
        direction={isResponsiveLayout ? "column" : "row"}
        sx={{ margin: "3rem" }}
      >
        {/* Left column */}
        <Stack
          spacing={4}
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
            variant="standard"
            {...register("title", {
              required: "Champ obligatoire",
              maxLength: {
                value: 50,
                message: "50 caractères maximum",
              },
            })}
            onChange={(e) => {
              const { value } = e.target;
              setValue("title", value, { shouldValidate: true });
            }}
            placeholder="Titre de l'annonce"
            error={!!errors.title || title?.length > 50}
            helperText={errors.title?.message}
            sx={{
              backgroundColor: "var(--white)",
            }}
          />

          {/* Description de l'annonce */}
          <TextField
            type="text"
            label="Description"
            variant="standard"
            multiline
            maxRows={3}
            {...register("description", {
              required: "Champ obligatoire",
              maxLength: {
                value: 255,
                message: "255 caractères maximum",
              },
            })}
            onChange={(e) => {
              const { value } = e.target;
              setValue("description", value, { shouldValidate: true });
            }}
            placeholder="Description"
            error={!!errors.description || description?.length > 255}
            helperText={errors.description?.message}
            sx={{ backgroundColor: "var(--white)" }}
          />

          {/* Adresse de l'annonce */}
          <Controller
            name="address"
            control={control}
            rules={{
              required: "Champ obligatoire",
            }}
            render={({ field }) => (
              <AdModalFormAddress
                selectedSuggestion={selectedSuggestion}
                onSuggestionChange={(value) => {
                  field.onChange(value);
                  setSelectedSuggestion(value);
                }}
                error={errors.address?.message}
              />
            )}
          />

          {/* Compétence requise pour l'annonce */}
          <FormControl
            error={!!errors.skillId}
            variant="standard"
            sx={{ backgroundColor: "var(--white)" }}
          >
            <InputLabel>Catégorie</InputLabel>
            <Select
              {...register("skillId", { required: "Champ obligatoire" })}
              defaultValue=""
              disabled={skillsLoading || !!skillsError}
            >
              {skills.map((skill) => (
                <MenuItem key={skill.id} value={skill.id}>
                  {skill.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.skillId?.message}</FormHelperText>
          </FormControl>
        </Stack>

        {/* Divider */}
        {!isResponsiveLayout && (
          <Divider orientation="vertical" flexItem sx={{ margin: "0 4rem" }} />
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
          {/* Durée de l'annonce */}
          <Controller
            name="duration"
            control={control}
            rules={{
              required: "Veuillez sélectionner une durée.",
              validate: (value) =>
                value > 0 || "Veuillez sélectionner une durée.",
            }}
            render={({ field }) => (
              <FormControl>
                <FormLabel sx={{ textAlign: "center" }}>DUREE</FormLabel>
                <Slider
                  {...field}
                  size="small"
                  sx={{ width: "80%", margin: "0 auto" }}
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
              </FormControl>
            )}
          />
          <FormHelperText>{errors.duration?.message}</FormHelperText>

          {/* Photos */}
          <Typography color="rgba(0, 0, 0, 0.6)" sx={{ textAlign: "center" }}>
            AJOUTER DES PHOTOS
          </Typography>
          <Stack direction="row" sx={{ justifyContent: "center" }}>
            {/* Affichage des trois conteneurs pour les images */}
            {[0, 1, 2].map((index) => (
              <Box
                key={index}
                sx={{
                  width: 92,
                  height: 86,
                  borderRadius: 2.5,
                  backgroundColor: "#E0E0E0",
                  border: "2px dotted #AFACAC",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {/* Si un fichier est sélectionné, afficher l'image */}
                {files[index] ? (
                  <>
                    <img
                      src={fileUrls[index]}
                      alt={`photo-${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                    {/* Icône de suppression */}
                    <IconButton
                      onClick={() => handleDelete(index)}
                      sx={{
                        position: "absolute",
                        top: "0.1rem",
                        right: "0.1rem",
                        color: "white",
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </>
                ) : (
                  <>
                    {/* Si aucun fichier sélectionné, afficher l'icône d'appareil photo*/}
                    <IconButton
                      component="label"
                      sx={{
                        position: "absolute",
                        zIndex: 1,
                      }}
                    >
                      <CameraAlt
                        sx={{
                          width: 50,
                          height: 50,
                        }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleFileChange(e, index)}
                      />
                    </IconButton>
                  </>
                )}
              </Box>
            ))}
          </Stack>
        </Stack>
      </Stack>

      {/* Submit button */}
      <Stack
        sx={{
          alignItems: "flex-end",
          margin: "2.5rem",
        }}
      >
        <Button type="submit">Envoyer</Button>
      </Stack>
      {loading && "Envoi en cours..."}
      {error && "Une erreur est survenue, merci de réessayer..."}
    </form>
  );
}

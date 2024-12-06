import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { AdInput, useCreateAdMutation } from "../../../generated/graphql-types";
import { useState } from "react";
import theme from "../../../mui";
import AdModalFormAddress from "./AdModalFormAddress";
import { CameraAlt } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import AdModalFormTitle from "./AdModalFormTitle";
import AdModalFormDescription from "./AdModalFormDescription";
import AdModalFormCategory from "./AdModalFormCategory";
import AdModalFormDuration from "./AdModalFormDuration";
import { AddressSuggestion } from "../../../types";
import Cookies from "js-cookie";

interface AdModalFormProps {
  closeModal: () => void;
}

export default function AdModalForm({ closeModal }: AdModalFormProps) {
  const userId = Cookies.get("cdmg-userId");
  const isResponsiveLayout = useMediaQuery(theme.breakpoints.down("md"));
  const methods = useForm<AdInput>({
    defaultValues: { title: "", description: "", duration: 0 },
  });

  const [createAdMutation, { loading, error }] = useCreateAdMutation();

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

  // Selection de l'adresse
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<AddressSuggestion | null>(null);

  // Gestion de la soumission du formulaire
  const onFormSubmitted = async (formData: AdInput) => {
    if (!selectedSuggestion) {
      console.error("Aucune adresse sélectionnée");
      return;
    }

    if (!userId) {
      console.error("L'utilisateur n'est pas connecté");
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
            // picture1: files[0] || null,
            // picture2: files[1] || null,
            // picture3: files[2] || null,
            skillId: formData.skillId,
            userRequesterId: userId,
          },
        },
      });
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la création de l'annonce :", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onFormSubmitted)}>
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
            <AdModalFormTitle />

            {/* Description de l'annonce */}
            <AdModalFormDescription />

            {/* Adresse de l'annonce */}
            <AdModalFormAddress setSelectedSuggestion={setSelectedSuggestion} />

            {/* Compétence requise pour l'annonce */}
            <AdModalFormCategory />
          </Stack>

          {/* Divider */}
          {!isResponsiveLayout && (
            <Divider
              orientation="vertical"
              flexItem
              sx={{ margin: "0 4rem" }}
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
            {/* Durée de l'annonce */}
            <AdModalFormDuration />

            {/* Photos */}
            <Typography color="rgba(0, 0, 0, 0.6)" sx={{ textAlign: "center" }}>
              PHOTOS
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
    </FormProvider>
  );
}

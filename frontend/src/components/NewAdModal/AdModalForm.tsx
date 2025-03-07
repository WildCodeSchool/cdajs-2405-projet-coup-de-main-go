import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import {
  AdInput,
  Status,
  useCreateAdMutation,
} from "../../generated/graphql-types";
import { useState } from "react";
import theme from "../../mui";
import AdModalFormAddress from "./modalComponents/AdModalFormAddress";
import { CameraAlt } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import AdModalFormTitle from "./modalComponents/AdModalFormTitle";
import AdModalFormDescription from "./modalComponents/AdModalFormDescription";
import AdModalFormCategory from "./modalComponents/AdModalFormCategory";
import AdModalFormDuration from "./modalComponents/AdModalFormDuration";
import { AddressSuggestion } from "../../types";
import Cookies from "js-cookie";
import { convertFileToBase64 } from "../../utils/convertFileToBase64";
import { GET_ADS_BY_USER_QUERY } from "../../graphql/adQueries";
import { useNavigate } from "react-router-dom";

export default function AdModalForm({ onClose }: { onClose: () => void }) {
  const userId = Cookies.get("cdmg-userId");
  const isResponsiveLayout = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const methods = useForm<AdInput>({
    defaultValues: { title: "", description: "", duration: 0, skillId: "" },
  });

  const [createAdMutation, { loading, error }] = useCreateAdMutation({
    refetchQueries: [
      {
        query: GET_ADS_BY_USER_QUERY,
        variables: { userId: userId, status: Status.Posted },
      },
    ],
  });

  // Pictures and preview management
  const MAX_SIZE_MB = 1;
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file size
      if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`La taille du fichier doit être inférieure à ${MAX_SIZE_MB} Mo.`);
        return;
      }

      // Update file table
      const newFiles = [...files];
      newFiles[index] = selectedFile;
      setFiles(newFiles);
      // Update URLs table
      const fileUrl = URL.createObjectURL(selectedFile);
      const newFileUrls = [...fileUrls];
      newFileUrls[index] = fileUrl;
      setFileUrls(newFileUrls);
    }
  };

  const handleDelete = (index: number) => {
    // Delete file
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    // Delete URL
    URL.revokeObjectURL(fileUrls[index]);
    const newFileUrls = [...fileUrls];
    newFileUrls.splice(index, 1);
    setFileUrls(newFileUrls);
  };

  // Address selection
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<AddressSuggestion | null>(null);

  // NewAdForm submission
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
      const pictures = await Promise.all(
        files.map((file) => (file ? convertFileToBase64(file) : null))
      );

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
            picture1: pictures[0] as string | null,
            picture2: pictures[1] as string | null,
            picture3: pictures[2] as string | null,
            skillId: formData.skillId,
            userRequesterId: userId,
          },
        },
      });
      onClose();
      navigate(`/profil`, {
        state: { message: "Annonce ajoutée avec succès !" },
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'annonce :", error);
    }
  };

  return (
    <>
      <Typography
        variant="h3"
        component="h2"
        sx={{ fontWeight: 600, textAlign: "center" }}
      >
        Créer une annonce
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onFormSubmitted)}>
          <Stack
            direction={isResponsiveLayout ? "column" : "row"}
            sx={{ margin: "3rem", gap: 2 }}
          >
            {/* Left column */}
            <Stack
              spacing={3}
              sx={{
                width: {
                  xs: "100%",
                  md: "60%",
                },
              }}
            >
              {/* Title */}
              <AdModalFormTitle />

              {/* Description  */}
              <AdModalFormDescription />

              {/* Adresse autocompletion */}
              <AdModalFormAddress
                setSelectedSuggestion={setSelectedSuggestion}
              />

              {/* Skill */}
              <AdModalFormCategory />
            </Stack>

            {/* Divider */}
            {!isResponsiveLayout && <Divider orientation="vertical" flexItem />}

            {/* Right column */}
            <Stack
              sx={{
                width: {
                  xs: "100%",
                  md: "40%",
                },
              }}
            >
              {/* Duration */}
              <AdModalFormDuration />

              {/* Pictures */}
              <Typography
                color={theme.palette.text.secondary}
                sx={{ fontSize: "1.25rem", textAlign: "center" }}
              >
                Photos
              </Typography>
              <Stack direction="row" sx={{ justifyContent: "center" }}>
                {/* Pictures' containers */}
                {[0, 1, 2].map((index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 92,
                      height: 86,
                      borderRadius: 2.5,
                      backgroundColor: theme.palette.custom.main,
                      border: "2px dotted",
                      borderColor: theme.palette.custom.dark,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    {/* When a file is selected, preview is visible */}
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
                        {/* Delete preview icon */}
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
                        {/* When no files is selected, the camera icon is visible*/}
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
              margin: "1.5rem 2.5rem",
            }}
          >
            <Button type="submit" sx={{ paddingX: 4 }}>
              Envoyer
            </Button>
          </Stack>
          {loading && <CircularProgress />}
          {error && "Une erreur est survenue, merci de réessayer..."}
        </form>
      </FormProvider>
    </>
  );
}

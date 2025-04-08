import {
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import {
  AdInput,
  GetAdByIdQuery,
  Status,
  useCreateAdMutation,
  useUpdateAdMutation,
} from "../../../generated/graphql-types";
import { useEffect, useState } from "react";
import theme from "../../../mui";
import AdModalFormAddress from "./AdModalFormAddress";
import AdModalFormTitle from "./AdModalFormTitle";
import AdModalFormDescription from "./AdModalFormDescription";
import AdModalFormCategory from "./AdModalFormCategory";
import AdModalFormDuration from "./AdModalFormDuration";
import { AddressSuggestion } from "../../../types";
import { convertFileToBase64 } from "../../../utils/convertFileToBase64";
import { GET_ADS_BY_USER_QUERY } from "../../../graphql/adQueries";
import { useNavigate } from "react-router-dom";
import AdModalFormPhotos from "./AdModalFormPhotos";
import { useAuth } from "../../../contexts/AuthContext";

interface AdModalFormProps {
  onClose: () => void;
  isEditing?: boolean;
  ad?: GetAdByIdQuery["getAdById"] | null | undefined;
}

export default function AdModalForm({
  onClose,
  isEditing,
  ad,
}: AdModalFormProps) {
  const { userId } = useAuth();
  const isResponsiveLayout = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  // Address selection
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<AddressSuggestion | null>(null);

  const methods = useForm<AdInput>({
    defaultValues: {
      title: ad ? ad.title : "",
      description: ad ? ad.description : "",
      address: ad ? ad.address : "",
      zipCode: ad ? ad.zipCode : "",
      city: ad ? ad.city : "",
      latitude: ad ? ad.latitude : 0,
      longitude: ad ? ad.longitude : 0,
      duration: ad ? ad.duration : 0,
      skillId: ad ? ad.skill.id : "",
    },
  });

  useEffect(() => {
    if (ad) {
      setSelectedSuggestion({
        properties: {
          label: `${ad.address} ${ad.zipCode} ${ad.city}`,
          name: ad.address,
          postcode: ad.zipCode,
          city: ad.city,
        },
        geometry: {
          coordinates: [ad.longitude ?? 0, ad?.latitude ?? 0],
        },
      });
    }
  }, [ad, methods]);

  const [createAdMutation, { loading: loadingCreate, error: errorCreate }] =
    useCreateAdMutation({
      refetchQueries: [
        {
          query: GET_ADS_BY_USER_QUERY,
          variables: { userId: userId, status: Status.Posted },
        },
      ],
    });

  const [updateAdMutation, { loading: loadingUpdate, error: errorUpdate }] =
    useUpdateAdMutation({
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

    const pictures = await Promise.all(
      files.map((file) => (file ? convertFileToBase64(file) : null))
    );

    const commonData = {
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
    };

    try {
      if (isEditing && ad) {
        await updateAdMutation({
          variables: {
            id: ad.id,
            formData: commonData,
          },
        });
      } else {
        await createAdMutation({
          variables: {
            formData: {
              ...commonData,
              userRequesterId: userId,
            },
          },
        });
      }

      onClose();
      navigate(`/profil`, {
        state: {
          message: isEditing
            ? "Annonce modifiée avec succès !"
            : "Annonce ajoutée avec succès !",
        },
      });
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire :", error);
    }
  };

  return (
    <>
      <Typography
        variant="h3"
        component="h2"
        sx={{ fontWeight: 600, textAlign: "center" }}
      >
        {isEditing ? "Modifiez votre annonce" : "Créer une annonce"}
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
                selectedSuggestion={selectedSuggestion}
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
              <AdModalFormPhotos
                files={files}
                fileUrls={fileUrls}
                handleFileChange={handleFileChange}
                handleDelete={handleDelete}
              />
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
          {(loadingCreate || loadingUpdate) && <CircularProgress />}
          {(errorCreate || errorUpdate) &&
            "Une erreur est survenue, merci de réessayer..."}
        </form>
      </FormProvider>
    </>
  );
}

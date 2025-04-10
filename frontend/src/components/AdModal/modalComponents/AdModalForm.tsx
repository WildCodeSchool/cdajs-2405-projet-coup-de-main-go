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
import theme from "../../../mui";
import AdModalFormAddress from "./AdModalFormAddress";
import AdModalFormTitle from "./AdModalFormTitle";
import AdModalFormDescription from "./AdModalFormDescription";
import AdModalFormCategory from "./AdModalFormCategory";
import AdModalFormDuration from "./AdModalFormDuration";
import AdModalFormPictures from "./AdModalFormPictures";
import {
  GET_ADS_BY_USER_QUERY,
  GET_ALL_ADS_QUERY,
} from "../../../graphql/adQueries";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { isBase64 } from "../../../utils/checkBase64";

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
      picture1: ad && ad.picture1 ? ad.picture1 : "",
      picture2: ad && ad.picture2 ? ad.picture2 : "",
      picture3: ad && ad.picture3 ? ad.picture3 : "",
    },
  });

  const [createAdMutation, { loading: loadingCreate, error: errorCreate }] =
    useCreateAdMutation({
      refetchQueries: [
        {
          query: GET_ADS_BY_USER_QUERY,
          variables: { userId: userId, status: Status.Posted },
        },
        {
          query: GET_ALL_ADS_QUERY,
          variables: { skillId: null, status: Status.Posted, limit: 4 },
        },
        {
          query: GET_ALL_ADS_QUERY,
          variables: { skillId: 1, status: Status.Posted, limit: 4 },
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
        {
          query: GET_ALL_ADS_QUERY,
          variables: { skillId: null, status: Status.Posted, limit: 4 },
        },
        {
          query: GET_ALL_ADS_QUERY,
          variables: { skillId: 1, status: Status.Posted, limit: 4 },
        },
      ],
    });

  // AdForm submission
  const onFormSubmitted = async (formData: AdInput) => {
    if (!userId) {
      console.error("Erreur sur l'identifiant de l'utilisateur");
      return;
    }

    const commonData = {
      ...formData,
      mangoAmount: formData.duration / 30,
      picture1: formData.picture1,
      picture2: formData.picture2,
      picture3: formData.picture3,
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
              <AdModalFormAddress ad={ad} />

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
              <AdModalFormPictures adId={ad?.id} />
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
              Valider
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

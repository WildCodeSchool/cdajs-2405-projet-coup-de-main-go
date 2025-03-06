import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useDeleteAdMutation } from "../../generated/graphql-types";
import { GET_ADS_BY_USER_QUERY } from "../../graphql/adQueries";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface DeleteAdModalProps {
  adId: string;
  setDeleteModalOpen: (deleteModalOpen: boolean) => void;
}

export default function DeleteAdModal({
  adId,
  setDeleteModalOpen,
}: DeleteAdModalProps) {
  const navigate = useNavigate();
  const userId = Cookies.get("cdmg-userId") || "";

  const [deleteAd, { loading, error }] = useDeleteAdMutation({
    variables: { id: adId, userRequesterId: userId },
    refetchQueries: [
      { query: GET_ADS_BY_USER_QUERY, variables: { userId: userId } },
    ],
  });

  const handleCancelClick = () => {
    setDeleteModalOpen(false);
  };

  const handleDeleteClick = async () => {
    try {
      const response = await deleteAd();

      if (response.data?.deleteAd) {
        setDeleteModalOpen(false);
        navigate(`/profil`, {
          state: { message: "Annonce supprimée avec succès !" },
        });
      }
    } catch (e) {
      console.error("Error deleting ad:", e);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Typography
        variant="h5"
        component="h2"
        sx={{ fontWeight: 600, textAlign: "center", mb: 5 }}
      >
        Supprimer l'annonce
      </Typography>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-around",
        }}
      >
        <Button sx={{ width: "10rem" }} onClick={handleDeleteClick}>
          Confirmer
        </Button>
        <Button
          variant="outlined"
          sx={{ color: "primary.main", width: "10rem" }}
          onClick={handleCancelClick}
        >
          Annuler
        </Button>
      </Stack>
    </>
  );
}

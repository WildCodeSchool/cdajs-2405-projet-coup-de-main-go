import { Button, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import GenericModal from "../Modal/GenericModal";
import DeleteAdModal from "../DeleteAdModal/DeleteAdModal";
import theme from "../../mui";

interface AdCardButtonsProps {
  adId: string;
  isProfileCard?: boolean;
}

export default function AdCardButtons({
  adId,
  isProfileCard,
}: AdCardButtonsProps) {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  return isProfileCard ? (
    <>
      <Button>Modifier</Button>
      <Button
        variant="outlined"
        sx={{ color: "primary.main" }}
        onClick={handleDeleteClick}
      >
        Supprimer
      </Button>

      <GenericModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        maxWidth={isMobile ? "80%" : "30%"}
        bgColor="white"
      >
        <DeleteAdModal adId={adId} setDeleteModalOpen={setDeleteModalOpen} />
      </GenericModal>
    </>
  ) : (
    <>
      <Button
        component={Link}
        color={"secondary"}
        to={`/ad/${adId}`}
        sx={{
          textAlign: "center",
          lineHeight: "1rem",
          paddingY: 1,
          paddingX: 4,
        }}
      >
        Plus
        <br />
        d'informations
      </Button>
    </>
  );
}

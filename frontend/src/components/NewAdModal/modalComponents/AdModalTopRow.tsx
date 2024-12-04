import { IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface AdModalTopRowProps {
  closeModal: () => void;
}

export default function AdModalTopRow({ closeModal }: AdModalTopRowProps) {
  return (
    <Stack
      direction="row"
      sx={{
        position: "relative",
        justifyContent: "center",
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
  );
}

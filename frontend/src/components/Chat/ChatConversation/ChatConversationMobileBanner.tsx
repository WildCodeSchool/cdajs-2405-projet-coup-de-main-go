import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { formatFullName } from "../../../utils/formatName";
import { useTheme } from "@mui/material/styles";

type ChatConversationMobileBannerProps = {
  otherUser: {
    id: number;
    picture: string;
    firstName: string;
    lastName: string;
  };
  onBack?: () => void;
  onOpenModal?: () => void;
};

export default function ChatConversationMobileBanner({
  otherUser,
  onBack,
  onOpenModal,
}: ChatConversationMobileBannerProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1,
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
        zIndex: 10,
        position: "sticky",
        top: 0,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={onBack}>
          <ArrowBackIosIcon />
        </IconButton>
        <Avatar
          src={`${import.meta.env.VITE_DOMAIN_BACKEND_URL}/uploads/users/${
            otherUser.id
          }/${otherUser.picture}`}
          alt={formatFullName(
            otherUser?.firstName ?? "Inconnu",
            otherUser?.lastName ?? ""
          )}
          sx={{ mr: 1 }}
        />
        <Typography variant="h6">
          {formatFullName(
            otherUser?.firstName ?? "Inconnu",
            otherUser?.lastName ?? ""
          )}
        </Typography>
      </Box>
      <Button
        variant="contained"
        onClick={onOpenModal}
        sx={{
          bgcolor: theme.palette.secondary.main,
          "&:hover": {
            bgcolor: theme.palette.secondary.dark,
          },
        }}
      >
        Voir l'annonce
      </Button>
    </Box>
  );
}

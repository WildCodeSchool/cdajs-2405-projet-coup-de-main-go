import { Box, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ChatConversationHeader({
  userRegistrationDate,
}: {
  userRegistrationDate: Date;
}) {
  const registrationDate = new Date(userRegistrationDate);

  const formattedDate = format(registrationDate, "MMMM yyyy", { locale: fr });

  return (
    <Box sx={{ p: 1, pl: 2, borderBottom: 3, borderColor: "divider" }}>
      <Typography
        variant="subtitle1"
        component="span"
        sx={{ ml: 1, fontWeight: "600" }}
      >
        À propos de ce membre
      </Typography>
      <Box sx={{ display: "flex" }}>
        <PersonIcon />
        <Typography variant="subtitle2" color="text.secondary">
          Membre depuis {formattedDate}
        </Typography>
      </Box>
    </Box>
  );
}

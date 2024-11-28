import { Box, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default function ChatConversationHeader({
  userRegistrationDate,
}: {
  userRegistrationDate: Date;
}) {
  const registrationDate = new Date(userRegistrationDate);

  const relativeDate = formatDistanceToNow(registrationDate, { addSuffix: true, locale: fr });

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
          Membre depuis {relativeDate}
        </Typography>
      </Box>
    </Box>
  );
}

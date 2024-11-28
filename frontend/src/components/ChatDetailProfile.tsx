import { Avatar, Box, Typography } from "@mui/material";
import { formatFullName } from "../utils/formatName";
import { User } from "../types";

type ChatDetailProfileProps = {
  userHelper?: User;
};

export default function ChatDetailProfile({
  userHelper,
}: ChatDetailProfileProps) {
  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderBottom: 2,
        borderColor: "divider",
      }}
    >
      <Avatar
        src={`person/${userHelper?.picture}`}
        alt={formatFullName(
          userHelper?.firstName ?? "Inconnu",
          userHelper?.lastName ?? ""
        )}
        sx={{ width: 54, height: 54, mr: 2 }}
      />
      <Box>
        <Typography variant="h6">
          {formatFullName(
            userHelper?.firstName ?? "Inconnu",
            userHelper?.lastName ?? ""
          )}
        </Typography>
      </Box>
    </Box>
  );
}

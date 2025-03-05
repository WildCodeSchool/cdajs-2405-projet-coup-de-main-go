import { Avatar, Box, Typography } from "@mui/material";
import { formatFullName } from "../../../utils/formatName";
import { User } from "../../../types";

type ChatDetailProfileProps = {
  userRequester?: User;
};

export default function ChatDetailProfile({
  userRequester,
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
        src={`${import.meta.env.VITE_DOMAIN_BACKEND_URL}/uploads/users/${userRequester?.id}/${userRequester?.picture}`}
        alt={formatFullName(
          userRequester?.firstName ?? "Inconnu",
          userRequester?.lastName ?? ""
        )}
        sx={{ width: 54, height: 54, mr: 2 }}
      />
      <Box>
        <Typography variant="h6">
          {formatFullName(
            userRequester?.firstName ?? "Inconnu",
            userRequester?.lastName ?? ""
          )}
        </Typography>
      </Box>
    </Box>
  );
}

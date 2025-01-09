import { IconButton, Badge, Box, useTheme } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Link } from "react-router-dom";

interface AuthenticatedIconsProps {
  isMobile: boolean;
}

export default function AuthenticatedIcons({ isMobile }: AuthenticatedIconsProps) {
  const theme = useTheme();

  return (
    <>
      <IconButton component={Link} to="/chat">
        <ChatBubbleOutlineIcon
          fontSize="large"
          style={{
            color: theme.palette.common.black,
            marginRight: isMobile ? 0 : 2,
          }}
        />
      </IconButton>
      <IconButton>
        <HelpOutlineIcon
          fontSize="large"
          style={{
            color: theme.palette.common.black,
            marginRight: isMobile ? 0 : 2,
          }}
        />
      </IconButton>
      <IconButton sx={{ position: "relative", marginRight: isMobile ? 0 : 2 }}>
        <Box
          component="img"
          src="/images/mango.png"
          alt="Mango notification"
          sx={{
            width: 40,
            height: 40,
            position: "relative",
          }}
        />
        <Badge
          badgeContent={4}
          sx={{
            position: "absolute",
            bottom: 20,
            right: 24,
          }}
        />
      </IconButton>
    </>
  );
}

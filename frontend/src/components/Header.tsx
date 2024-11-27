import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Box,
  Avatar,
  Button,
} from "@mui/material";
import { Help } from "@mui/icons-material";
import Logo from "./Logo";
import HeaderButton from "./HeaderButton";

export default function Header() {
  return (
    <AppBar position="static" sx={{ bgcolor: "transparent" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Logo />
          <HeaderButton
            variant="contained"
            color="var(--tertiary)"
            text="Créer une annonce"
            icon="./mango.png"
          />
          <HeaderButton
            variant="contained"
            color="var(--secondary)"
            text="Explorer"
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton>
            <Help />
          </IconButton>
          <IconButton sx={{ position: "relative", pr: 2 }}>
            <Box
              component="img"
              src="/mango.png"
              alt="Mango notification"
              sx={{
                width: 40,
                height: 40,
                position: "relative",
              }}
            />
            <Badge
              badgeContent={4}
              color="warning"
              sx={{
                position: "absolute",
                bottom: 20,
                right: 24,
              }}
            />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              sx={{
                textTransform: "none",
                bgcolor: "var(--badge)",
                color: "white",
                "&:hover": { bgcolor: "var(--badge-hover)" },
              }}
              startIcon={<Avatar sx={{ width: 24, height: 24 }} />}
            >
              Célia K.
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

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
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <AppBar position="static" sx={{ bgcolor: "transparent" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <img src="/logo.png" alt="Coup de main-go" height="40" />
          </Link>
          <Button
            variant="contained"
            sx={{
              bgcolor: "var(--tertiary)",
              "&:hover": { bgcolor: "var(--tertiary-hover)" },
              mr: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src="./mango.png"
                alt="mango"
                style={{ width: 16, paddingRight: 4 }}
              />
              Créer une annonce
            </Box>
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: "var(--secondary)",
              "&:hover": { bgcolor: "var(--secondary-hover)" },
            }}
          >
            Explorer
          </Button>
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

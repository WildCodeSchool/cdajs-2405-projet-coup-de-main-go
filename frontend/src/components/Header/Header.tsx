import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Box,
  Avatar,
  Button,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Logo from "./Logo";
import HeaderButton from "../Header/HeaderButton";
import { useState } from "react";
import { useAuthModal } from "../../contexts/AuthModalContext";
import { Link } from "react-router-dom";

interface HeaderProps {
  isAuthenticated: boolean;
}

export default function Header({ isAuthenticated }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { authModalIsOpen, setAuthModalIsOpen } = useAuthModal();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "transparent", border: 0 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Logo />
            {isAuthenticated && !isMobile && (
              <>
                <HeaderButton
                  color="secondary"
                  text="Créer une annonce"
                  icon="./mango.png"
                />
                <HeaderButton color="primary" text="Explorer" paddingX={4} />
              </>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isAuthenticated ? (
              <>
                <IconButton component={Link} to="/chat">
                  <ChatBubbleOutlineIcon
                    fontSize="large"
                    style={{ color: "black" }}
                  />
                </IconButton>
                <IconButton>
                  <HelpOutlineIcon
                    fontSize="large"
                    style={{ color: "black" }}
                  />
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
                    color="primary"
                    startIcon={<Avatar sx={{ width: 24, height: 24 }} />}
                  >
                    Célia K.
                  </Button>
                </Box>
              </>
            ) : (
              <>
                {!authModalIsOpen && (
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "var(--secondary)",
                      "&:hover": { bgcolor: "var(--secondary-hover)" },
                    }}
                    onClick={() => setAuthModalIsOpen(true)}
                  >
                    S’inscrire / Se connecter
                  </Button>
                )}
              </>
            )}
            {isMobile && isAuthenticated && (
              <IconButton onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
        <List sx={{ width: 250 }}>
          {isAuthenticated && (
            <>
              <ListItemButton onClick={handleDrawerToggle}>
                <ListItemText primary="Créer une annonce" />
              </ListItemButton>
              <ListItemButton onClick={handleDrawerToggle}>
                <ListItemText primary="Explorer" />
              </ListItemButton>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}

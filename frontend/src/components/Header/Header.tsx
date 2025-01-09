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
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import GenericModal from "../Modal/GenericModal";
import AdModalForm from "../NewAdModal/AdModalForm";

interface HeaderProps {
  setAuthModalIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Header({ setAuthModalIsOpen }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { isAuthenticated } = useAuth();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const [newAdModalIsOpen, setNewAdModalIsOpen] = useState<boolean>(false);
  const closeNewAdModal = () => {
    setNewAdModalIsOpen(false);
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "transparent", border: 0 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                !isAuthenticated && isMobile ? "center" : "flex-start",
              gap: !isAuthenticated || isMobile ? 0 : 2,
              ...(isMobile && { width: "100%" }),
            }}
          >
            <Logo />
            {isAuthenticated && !isMobile && (
              <>
                <HeaderButton
                  color="secondary"
                  text="Créer une annonce"
                  icon="/images/mango.png"
                  onClick={() => setNewAdModalIsOpen(true)}
                />
                <HeaderButton color="primary" text="Explorer" paddingX={4} />
              </>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isAuthenticated ? (
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
                <IconButton
                  sx={{ position: "relative", marginRight: isMobile ? 0 : 2 }}
                >
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
                <Box
                  sx={{
                    display: isMobile ? "none" : "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
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
                {!isAuthenticated && !isMobile && (
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      "&:hover": { bgcolor: theme.palette.primary.dark },
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24 }} />
                  <ListItemText primary="Célia K." />
                </Box>
              </ListItemButton>
              <ListItemButton
                onClick={handleDrawerToggle}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 2,
                }}
              >
                <HeaderButton
                  color="secondary"
                  text="Créer une annonce"
                  icon="/images/mango.png"
                  onClick={() => setNewAdModalIsOpen(true)}
                />
                <HeaderButton color="primary" text="Explorer" paddingX={4} />
              </ListItemButton>
            </>
          )}
        </List>
      </Drawer>

      {newAdModalIsOpen && (
        <GenericModal
          open={newAdModalIsOpen}
          onClose={closeNewAdModal}
          maxWidth="md"
        >
          <AdModalForm onClose={closeNewAdModal} />
        </GenericModal>
      )}
    </>
  );
}

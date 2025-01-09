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
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import { Logout, Menu as MenuIcon } from "@mui/icons-material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Logo from "./Logo";
import HeaderButton from "../Header/HeaderButton";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";

interface HeaderProps {
  setAuthModalIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Header({ setAuthModalIsOpen }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { isAuthenticated, logout } = useAuth();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
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
                    onClick={handleProfileClick}
                  >
                    Célia K.
                  </Button>
                  <Menu
                    id="account-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    slotProps={{
                      paper: {
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          mt: 1.5,
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Déconnexion
                    </MenuItem>
                  </Menu>
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
                />
                <HeaderButton color="primary" text="Explorer" paddingX={4} />
                <HeaderButton
                  color="error"
                  text="Déconnexion"
                  paddingX={4}
                  onClick={handleLogout}
                />
              </ListItemButton>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}

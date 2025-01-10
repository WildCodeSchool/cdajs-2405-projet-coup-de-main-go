import { AppBar, Toolbar, Box, useTheme, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "./Logo";
import HeaderButton from "../Header/HeaderButton";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import AuthenticatedIcons from "./AuthenticatedIcons";

interface HeaderProps {
  setAuthModalIsOpen: (isOpen: boolean) => void;
}

export default function Header({ setAuthModalIsOpen }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { isAuthenticated, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  // const [newAdModalIsOpen, setNewAdModalIsOpen] = useState<boolean>(false);
  // const closeNewAdModal = () => {
  //   setNewAdModalIsOpen(false);
  // };

  return (
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
              <AuthenticatedIcons isMobile={isMobile} />
              {isMobile ? (
                <MobileMenu
                  isOpen={drawerOpen}
                  onClose={handleDrawerToggle}
                  onToggle={handleDrawerToggle}
                  onLogout={logout}
                />
              ) : (
                <DesktopMenu onLogout={logout} />
              )}
            </>
          ) : (
            !isMobile && (
              <HeaderButton
                color="primary"
                text="S'inscrire / Se connecter"
                onClick={() => setAuthModalIsOpen(true)}
              />
            )
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

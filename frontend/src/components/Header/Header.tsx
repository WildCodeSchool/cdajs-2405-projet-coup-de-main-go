import { AppBar, Toolbar, Box, useTheme, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "./Logo";
import HeaderButton from "../Header/HeaderButton";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import AuthenticatedIcons from "./AuthenticatedIcons";
import { formatFullName } from "../../utils/formatName";
import { useMango } from "../../contexts/MangoContext";
import { useGetUserOverviewByIdQuery } from "../../generated/graphql-types";
import AdModal from "../AdModal/AdModal";

interface HeaderProps {
  setAuthModalIsOpen: (isOpen: boolean) => void;
}

export default function Header({ setAuthModalIsOpen }: HeaderProps) {
  const {
    mangoBalance,
    loading: loadingMangoBalance,
    error: errorMangoBalance,
  } = useMango();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { isAuthenticated, logout, userId } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const [adModalOpen, setAdModalOpen] = useState<boolean>(false);

  const handleAdModalOpen = () => {
    setAdModalOpen(true);
  };

  const handleAdModalClose = () => {
    setAdModalOpen(false);
  };

  const { data, loading, error } = useGetUserOverviewByIdQuery({
    variables: { id: userId || "" },
    skip: !userId,
  });
  const user = data?.getUserOverviewById?.user;
  const displayName = user
    ? formatFullName(user.firstName, user.lastName)
    : "Utilisateur inconnu";

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
                  onClick={handleAdModalOpen}
                />
                <HeaderButton
                  color="primary"
                  text="Explorer"
                  paddingX={4}
                  to={"/catalog"}
                />
              </>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isAuthenticated ? (
              <>
                <AuthenticatedIcons
                  isMobile={isMobile}
                  mangoBalance={mangoBalance}
                />
                {isMobile ? (
                  <MobileMenu
                    isOpen={drawerOpen}
                    onClose={handleDrawerToggle}
                    onToggle={handleDrawerToggle}
                    onLogout={logout}
                  />
                ) : (
                  <DesktopMenu
                    onLogout={logout}
                    displayName={displayName}
                    loading={loading || loadingMangoBalance}
                    error={error || errorMangoBalance}
                  />
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

      <AdModal open={adModalOpen} onClose={handleAdModalClose} />
    </>
  );
}

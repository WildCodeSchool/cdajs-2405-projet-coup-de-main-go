import { useState } from "react";
import { Box, Typography, Button, Avatar, Tabs, Tab, CircularProgress, useTheme } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useGetUserByIdQuery } from "../../generated/graphql-types";
import { useNavigate } from "react-router-dom";

export default function Profil() {
  const { userId } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // Requête Apollo : GetUserByEmail
  const { loading, error, data } = useGetUserByIdQuery({
    variables: { id: userId! },
    skip: !userId,
  });

  if (!userId) return null;

  if (loading)
    return (
      <Box sx={{ p: 4 }}>
        <CircularProgress size={36} sx={{ color: theme.palette.primary.main }} />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 4, display: "flex", alignItems: "center" }}>
        <Typography color="error">Erreur lors du chargement des informations utilisateur</Typography>
      </Box>
    );

  const user = data?.getUserById;

  if (!user) {
    return (
      <Box sx={{ p: 4, display: "flex", alignItems: "center" }}>
        <Typography color="error">Utilisateur non trouvé</Typography>
      </Box>
    );
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEditProfile = () => {
    navigate("/profile/modifier");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        p: 2,
        bgcolor: "#f7f7f7",
      }}
    >
      {/* Box principale contenant toutes les informations */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: "30px",
          width: { xs: "90%", md: "70%" },
          p: 3,
          position: "relative",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Avatar et informations utilisateur */}
        <Avatar
          src={user.picture || ""}
          sx={{
            width: 100,
            height: 100,
            border: "4px solid white",
            mb: 2,
          }}
        >
          {!user.picture && `${user.firstName[0]}${user.lastName[0]}`}
        </Avatar>
        <Typography variant="h6">{`${user.firstName} ${user.lastName}`}</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {user.biography || "Aucune biographie disponible"}
        </Typography>

        {/* Bouton Modifier le profil */}
        <Button
          variant="contained"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            borderRadius: "20px",
          }}
          onClick={handleEditProfile}
        >
          Modifier le profil
        </Button>

        {/* Boutons principaux */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: 2,
            width: "100%",
          }}
        >
          {user.skills.map((skill: { id: string; name: string }) => (
            <Button
              key={skill.id}
              variant="outlined"
              sx={{
                color: "black",
                borderRadius: "5px",
                borderColor: "black",
              }}
            >
              {skill.name}
            </Button>
          ))}
        </Box>

        {/* Onglets avec MUI */}
        <Box sx={{ width: "100%", mt: 4 }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "center",
              mt: 4,
              width: "100%",
            }}
          >
            <Tabs value={activeTab} onChange={handleChange}>
              <Tab label="Avis" />
              <Tab label="Annonces" />
            </Tabs>
          </Box>

          {/* Contenu des onglets */}
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <Typography variant="body1">Vous n'avez encore aucun avis.</Typography>
            )}
            {activeTab === 1 && (
              <Typography variant="body1">Vous n'avez encore publié aucune annonce.</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

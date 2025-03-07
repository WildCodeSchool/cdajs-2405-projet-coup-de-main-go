import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  useTheme,
  Avatar,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useGetUserByIdQuery } from "../../generated/graphql-types";
import { useNavigate } from "react-router-dom";
import ProfileActiveAds from "../../components/Profile/ProfileActiveAds";

export default function Profil() {
  const { userId } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const { loading, error, data } = useGetUserByIdQuery({
    variables: { id: userId! },
    skip: !userId,
  });

  if (!userId) return null;

  if (loading)
    return (
      <Box sx={{ p: 4 }}>
        <CircularProgress
          size={36}
          sx={{ color: theme.palette.primary.main }}
        />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 4, display: "flex", alignItems: "center" }}>
        <Typography color="error">
          Erreur lors du chargement des informations utilisateur
        </Typography>
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
    navigate("/profil/update", { state: { user } });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
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
        {/*Avatar*/}
        <Avatar
          src={`${import.meta.env.VITE_DOMAIN_BACKEND_URL}/uploads/users/${
            user.id
          }/${user.picture}`}
          sx={{
            width: 120,
            height: 120,
            mb: 2,
          }}
        >
          {!user.picture && `${user.firstName[0]}${user.lastName[0]}`}
        </Avatar>

        {/* Infos utilisateur */}
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

        {/* Skills */}
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
              sx={{ color: "black", borderRadius: "5px", borderColor: "black" }}
            >
              {skill.name}
            </Button>
          ))}
        </Box>

        {/* Onglets*/}
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
              <Tab label="Annonces en ligne" />
              <Tab label="Avis" />
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {activeTab === 0 && <ProfileActiveAds userId={userId} />}
            {activeTab === 1 && (
              <Typography variant="body1">
                Vous n'avez encore aucun avis.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

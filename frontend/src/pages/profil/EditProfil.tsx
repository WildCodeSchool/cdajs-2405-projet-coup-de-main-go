import { useState } from "react";
import { 
  Box, Typography, Button, Avatar, TextField, 
  CircularProgress, Snackbar, Alert, LinearProgress 
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useUpdateUserMutation } from "../../generated/graphql-types";
import { useNavigate, useLocation } from "react-router-dom";
import UpdateProfilePicturePage from "../UpdateProfilePicturePage"; 
import ProfilePictureUpload from "../UpdateProfilePicturePage";


export default function EditProfil() {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = state?.user;

  const [formValues, setFormValues] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    biography: user?.biography || "",
    address: user?.address || "",
    zipCode: user?.zipCode || "",
    city: user?.city || "",
  });

  const [updateUser, { loading, error }] = useUpdateUserMutation();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await updateUser({
        variables: {
          id: userId!,
          ...formValues,
        },
      });

      setOpenSnackbar(true);
      setProgress(0);

      const interval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(interval);
            navigate("/profile");
            return 100;
          }
          return Math.min(oldProgress + 10, 100);
        });
      }, 200);
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
        {/* Avatar */}
        <ProfilePictureUpload currentPicture={user?.picture} />



        <Typography variant="h6">{`${formValues.firstName} ${formValues.lastName}`}</Typography>

        {/* Champs modifiables */}
        <Box sx={{ width: "100%", mt: 2 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField label="Prénom" name="firstName" value={formValues.firstName} onChange={handleChange} fullWidth />
            <TextField label="Nom" name="lastName" value={formValues.lastName} onChange={handleChange} fullWidth />
          </Box>

          <TextField
            label="Biographie"
            name="biography"
            value={formValues.biography}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            multiline
            rows={3}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField label="Adresse" name="address" value={formValues.address} onChange={handleChange} fullWidth />
            <TextField label="Code postal" name="zipCode" value={formValues.zipCode} onChange={handleChange} sx={{ width: "250px" }} />
            <TextField label="Ville" name="city" value={formValues.city} onChange={handleChange} fullWidth />
          </Box>
        </Box>

        {/* Boutons */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Enregistrer"}
          </Button>
          <Button variant="outlined" sx={{color: "black"}} onClick={() => navigate("/profile")}>Annuler</Button>
        </Box>

        {error && <Typography color="error" sx={{ mt: 2 }}>Erreur lors de la mise à jour du profil.</Typography>}
      </Box>

      {/* Snackbar avec barre de progression */}
      <Snackbar
        open={openSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" sx={{ width: "100%", position: "relative" }}>
          Profil mis à jour avec succès !
          <LinearProgress variant="determinate" value={progress} sx={{ position: "absolute", bottom: 0, left: 0, width: "100%" }} />
        </Alert>
      </Snackbar>
    </Box>
  );
}

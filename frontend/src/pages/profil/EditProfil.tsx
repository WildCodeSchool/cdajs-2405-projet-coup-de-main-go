import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useUpdateUserMutation } from "../../generated/graphql-types";

export default function EditProfil() {
  const { userId } = useAuth();
  const [updateUser] = useUpdateUserMutation();
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    biography: "",
    address: "",
    zipCode: "",
    city: "",
  });

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
      alert("Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Modifier le profil
      </Typography>
      <TextField
        label="Prénom"
        name="firstName"
        value={formValues.firstName}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Nom"
        name="lastName"
        value={formValues.lastName}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Biographie"
        name="biography"
        value={formValues.biography}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Adresse"
        name="address"
        value={formValues.address}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Code postal"
        name="zipCode"
        value={formValues.zipCode}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Ville"
        name="city"
        value={formValues.city}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleSubmit}>
        Enregistrer les modifications
      </Button>
    </Box>
  );
}

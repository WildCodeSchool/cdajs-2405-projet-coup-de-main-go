import { useState, useEffect, ChangeEvent } from "react";
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useMutation } from "@apollo/client";
import { UPDATE_PROFILE_PICTURE } from "../graphql/users";
import { useAuth } from "../contexts/AuthContext";

export default function ProfilePictureUpload({ currentPicture }: { currentPicture?: string }) {
  const { userId } = useAuth();
  const [updateProfilePicture, { loading }] = useMutation(UPDATE_PROFILE_PICTURE);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [success, setSuccess] = useState(false);


  useEffect(() => {
    if (currentPicture && userId) {
      setPreviewUrl(`${import.meta.env.VITE_DOMAIN_BACKEND_URL}/uploads/users/${userId}/${currentPicture}`);
    }
  }, [currentPicture, userId]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
      setOpenDialog(true); // Ouvrir la confirmation
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const base64 = await convertFileToBase64(selectedFile);
      await updateProfilePicture({
        variables: { id: userId, picture: base64, filename: selectedFile.name },
      });

      setSuccess(true);
      setOpenDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  function convertFileToBase64(file: Blob) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }

  return (
    <Box sx={{ position: "relative", textAlign: "center" }}>
      {/* Avatar cliquable */}
      <label htmlFor="upload-photo">
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="upload-photo"
          type="file"
          onChange={handleFileChange}
        />
        <Avatar
          src={previewUrl || ""}
          sx={{
            width: 120,
            height: 120,
            border: "4px solid white",
            cursor: "pointer",
            transition: "0.3s",
            "&:hover": { opacity: 0.7 },
          }}
        />
        <IconButton
          component="span"
          sx={{
            position: "absolute",
            bottom: 10,
            right: 10,
            bgcolor: "rgba(0,0,0,0.6)",
            color: "white",
            "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
          }}
        >
          <PhotoCamera />
        </IconButton>
      </label>

      {/* Dialog de confirmation */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmer la mise à jour de la photo ?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleUpload} color="primary" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Mettre à jour"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de succès */}
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success">Photo mise à jour avec succès !</Alert>
      </Snackbar>
    </Box>
  );
}

import { ChangeEvent, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { UPDATE_PROFILE_PICTURE } from "../graphql/users";
import { useAuth } from "../contexts/AuthContext";

export default function UpdateProfilePicturePage() {
  const [updateProfilePicture, { data, loading, error }] = useMutation(
    UPDATE_PROFILE_PICTURE
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { handleSubmit } = useForm();
  const [file, setFile] = useState<File | null>(null);
  const { userId } = useAuth();

  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!file) return;

    try {
      const base64 = await convertFileToBase64(file);
      await updateProfilePicture({
        variables: {
          id: userId,
          picture: base64,
          filename: file.name,
        },
      });

      setSuccess("Photo de profil mise à jour avec succès!"); 
    } catch (error) {
      console.error(error);
      setSuccess(null);
    }
  };

  function convertFileToBase64(file: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("File reading failed"));
          }
        } else {
          reject(new Error("File reading failed"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Modifier la photo de profil
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField type="file" onChange={handleFileChange} fullWidth />
        {previewUrl && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: 200 }}
            />
          </Box>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            "Modifier"
          )}
        </Button>
      </form>
      {success && (
        <Typography variant="body1" color="success" sx={{ mt: 2 }}>
          {success}
        </Typography>
      )}
      {error && (
        <Typography variant="body1" color="error" sx={{ mt: 2 }}>
          {error.message}
        </Typography>
      )}
      {data &&
        data.updateProfilePicture &&
        data.updateProfilePicture.picture && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <img
              src={`${import.meta.env.VITE_UPLOAD_SERVICE_URL}/uploads/users/${userId}/${
                data.updateProfilePicture.picture
              }`}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: 200 }}
            />
          </Box>
        )}
    </Box>
  );
}

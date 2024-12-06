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
import { CREATE_AD } from "../graphql/adMutations";
import { useAuth } from "../contexts/AuthContext";

interface CreateAdData {
  title: string;
  description: string;
  address: string;
  zipCode: string;
  city: string;
  duration: number;
  mangoAmount: number;
  skillId: string;
  userRequesterId: string | null;
  picture1: string;
  picture2: string;
  picture3: string;
}

export default function CreateAdPage() {
  const [createAd, { data, loading, error }] = useMutation(CREATE_AD);
  const { userId } = useAuth();

  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [file3, setFile3] = useState<File | null>(null);

  const [previewUrl1, setPreviewUrl1] = useState<string | null>(null);
  const [previewUrl2, setPreviewUrl2] = useState<string | null>(null);
  const [previewUrl3, setPreviewUrl3] = useState<string | null>(null);

  const [fileError1, setFileError1] = useState<string | null>(null);
  const [fileError2, setFileError2] = useState<string | null>(null);
  const [fileError3, setFileError3] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const MAX_SIZE_MB = 1;

  const { handleSubmit } = useForm({
    defaultValues: {
      title: "Titre par défaut",
      description: "Description par défaut",
      address: "Adresse par défaut",
      zipCode: "12345",
      city: "Ville par défaut",
      duration: 30,
      mangoAmount: 100,
      skillId: "1",
      userRequesterId: userId,
      picture1: "",
      picture2: "",
      picture3: "",
    },
  });

  const onSubmit = async (formData: CreateAdData) => {
    const {
      title,
      description,
      address,
      zipCode,
      city,
      duration,
      mangoAmount,
      skillId,
    } = formData;

    try {
      const picture1 = file1 ? await convertFileToBase64(file1) : "";
      const picture2 = file2 ? await convertFileToBase64(file2) : "";
      const picture3 = file3 ? await convertFileToBase64(file3) : "";

      await createAd({
        variables: {
          adData: {
            title,
            description,
            address,
            zipCode,
            city,
            duration,
            mangoAmount,
            skillId,
            userRequesterId: userId,
            picture1,
            picture2,
            picture3,
          },
        },
      });

      setSuccess("Annonce créée avec succès!");
      setFile1(null);
      setFile2(null);
      setFile3(null);
      setPreviewUrl1(null);
      setPreviewUrl2(null);
      setPreviewUrl3(null);
      setFileError1(null);
      setFileError2(null);
      setFileError3(null);
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

  const handleFileChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      setSuccess(null);
      let fileError: string | null = null;

      if (selectedFile) {
        if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
          fileError = `Les fichiers doivent être inférieur à ${MAX_SIZE_MB}MB`;
        } else {
          fileError = null;
        }

        if (index === 1) {
          setFileError1(fileError);
          if (!fileError) {
            setFile1(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl1(reader.result as string);
            reader.readAsDataURL(selectedFile);
          }
        } else if (index === 2) {
          setFileError2(fileError);
          if (!fileError) {
            setFile2(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl2(reader.result as string);
            reader.readAsDataURL(selectedFile);
          }
        } else if (index === 3) {
          setFileError3(fileError);
          if (!fileError) {
            setFile3(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl3(reader.result as string);
            reader.readAsDataURL(selectedFile);
          }
        }
      }
    };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Créer une annonce
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          type="file"
          onChange={handleFileChange(1)}
          fullWidth
          sx={{ mt: 2 }}
        />
        {fileError1 && (
          <Typography variant="body1" color="error" sx={{ mt: 2 }}>
            {fileError1}
          </Typography>
        )}
        {previewUrl1 && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <img
              src={previewUrl1}
              alt="Preview 1"
              style={{ maxWidth: "100%", maxHeight: 200 }}
            />
          </Box>
        )}
        <TextField
          type="file"
          onChange={handleFileChange(2)}
          fullWidth
          sx={{ mt: 2 }}
        />
        {fileError2 && (
          <Typography variant="body1" color="error" sx={{ mt: 2 }}>
            {fileError2}
          </Typography>
        )}
        {previewUrl2 && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <img
              src={previewUrl2}
              alt="Preview 2"
              style={{ maxWidth: "100%", maxHeight: 200 }}
            />
          </Box>
        )}
        <TextField
          type="file"
          onChange={handleFileChange(3)}
          fullWidth
          sx={{ mt: 2 }}
        />{" "}
        {fileError3 && (
          <Typography variant="body1" color="error" sx={{ mt: 2 }}>
            {fileError3}
          </Typography>
        )}
        {previewUrl3 && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <img
              src={previewUrl3}
              alt="Preview 3"
              style={{ maxWidth: "100%", maxHeight: 200 }}
            />
          </Box>
        )}
        <Button
          type="submit"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading || !!fileError1 || !!fileError2 || !!fileError3}
        >
          {loading ? <CircularProgress size={24} /> : "Créer l'annonce"}
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
      {data && data.createAd && (
        <Box sx={{ mt: 2, mb: 2 }}>
          {data.createAd.picture1 && (
            <img
              src={`${import.meta.env.VITE_DOMAIN_BACKEND_URL}/uploads/ads/${
                data.createAd.id
              }/${data.createAd.picture1}`}
              alt="Preview 1"
              style={{ maxWidth: "100%", maxHeight: 200 }}
            />
          )}
          {data.createAd.picture2 && (
            <img
              src={`${import.meta.env.VITE_DOMAIN_BACKEND_URL}/uploads/ads/${
                data.createAd.id
              }/${data.createAd.picture2}`}
              alt="Preview 2"
              style={{ maxWidth: "100%", maxHeight: 200 }}
            />
          )}
          {data.createAd.picture3 && (
            <img
              src={`${import.meta.env.VITE_DOMAIN_BACKEND_URL}/uploads/ads/${
                data.createAd.id
              }/${data.createAd.picture3}`}
              alt="Preview 3"
              style={{ maxWidth: "100%", maxHeight: 200 }}
            />
          )}
        </Box>
      )}
    </Box>
  );
}

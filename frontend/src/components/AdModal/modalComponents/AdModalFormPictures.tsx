import { CameraAlt } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import theme from "../../../mui";
import { useFormContext } from "react-hook-form";
import { AdInput } from "../../../generated/graphql-types";
import { convertFileToBase64 } from "../../../utils/convertFileToBase64";

interface AdModalFormPhotosProps {
  adId?: string | null;
}

export default function AdModalFormPictures({ adId }: AdModalFormPhotosProps) {
  const MAX_SIZE_MB = 10;
  const methods = useFormContext<AdInput>();
  const { watch, setValue } = methods;

  const picture1 = watch("picture1");
  const picture2 = watch("picture2");
  const picture3 = watch("picture3");
  const pictures = [picture1, picture2, picture3];

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`La taille du fichier doit être inférieure à ${MAX_SIZE_MB} Mo.`);
      return;
    }

    const base64 = await convertFileToBase64(file);
    setValue(`picture${index + 1}` as keyof AdInput, base64);
  };

  const handleDeleteImage = (index: number) => {
    setValue(`picture${index + 1}` as keyof AdInput, "");
  };

  const getImageSrc = (pic: string) => {
    // Si pic est une URL complète ou une base64, on l'utilise directement
    if (pic.startsWith("http") || pic.startsWith("data:image")) {
      return pic;
    }

    // Si pic est juste un nom de fichier, on construit l'URL complète
    return `${
      import.meta.env.VITE_DOMAIN_BACKEND_URL
    }/uploads/ads/${adId}/${pic}`;
  };

  return (
    <>
      <Typography
        color={theme.palette.text.secondary}
        sx={{ fontSize: "1.25rem", textAlign: "center" }}
      >
        Photos
      </Typography>
      <Stack direction="row" sx={{ justifyContent: "center" }}>
        {/* Pictures' containers */}
        {pictures.map((pic, index) => (
          <Box
            key={index}
            sx={{
              width: 92,
              height: 86,
              borderRadius: 2.5,
              backgroundColor: theme.palette.custom.main,
              border: "2px dotted",
              borderColor: theme.palette.custom.dark,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* When a file is selected, preview is visible */}
            {pic ? (
              <>
                <img
                  src={getImageSrc(pic)}
                  alt={`preview ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
                {/* Delete preview icon */}
                <IconButton
                  onClick={() => handleDeleteImage(index)}
                  sx={{
                    position: "absolute",
                    top: "0.1rem",
                    right: "0.1rem",
                    color: "white",
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </>
            ) : (
              <>
                {/* When no files is selected, the camera icon is visible*/}
                {/* <label
                  htmlFor={`picture${index + 1}`}
                > */}
                <input
                  type="file"
                  id={`picture${index + 1}`}
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, index)}
                  hidden
                />
                <IconButton
                  component="label"
                  sx={{
                    position: "absolute",
                    zIndex: 1,
                  }}
                >
                  <CameraAlt
                    sx={{
                      position: "absolute",
                      zIndex: 1,
                      width: 50,
                      height: 50,
                    }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      handleFileChange(e, index);
                    }}
                  />
                </IconButton>
                {/* </label> */}
              </>
            )}
          </Box>
        ))}
      </Stack>
    </>
  );
}

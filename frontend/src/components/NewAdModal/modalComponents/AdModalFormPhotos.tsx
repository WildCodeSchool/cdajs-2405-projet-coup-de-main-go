import { CameraAlt } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import theme from "../../../mui";

type AdModalFormPhotosProps = {
  files: File[];
  fileUrls: string[];
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  handleDelete: (index: number) => void;
};

export default function AdModalFormPhotos({
  files,
  fileUrls,
  handleFileChange,
  handleDelete,
}: AdModalFormPhotosProps) {
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
        {[0, 1, 2].map((index) => (
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
            {files[index] ? (
              <>
                <img
                  src={fileUrls[index]}
                  alt={`photo-${index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
                {/* Delete preview icon */}
                <IconButton
                  onClick={() => handleDelete(index)}
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
                <IconButton
                  component="label"
                  sx={{
                    position: "absolute",
                    zIndex: 1,
                  }}
                >
                  <CameraAlt
                    sx={{
                      width: 50,
                      height: 50,
                    }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e, index)}
                  />
                </IconButton>
              </>
            )}
          </Box>
        ))}
      </Stack>
    </>
  );
}

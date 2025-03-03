import {
  Box,
  Button,
  FormControl,
  IconButton,
  Slider,
  Typography,
} from "@mui/material";
import { useState } from "react";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";

type DistanceFilterProps = {
  selectedMaxDistance: number;
  setSelectedMaxDistance: (selectedMaxDistance: number) => void;
};

export default function DistanceFilter({
  selectedMaxDistance,
  setSelectedMaxDistance,
}: DistanceFilterProps) {
  const [showSlider, setShowSlider] = useState(false);

  const isMaxDistanceSelected = () => {
    return selectedMaxDistance != 0;
  };

  return (
    <FormControl sx={{ m: 1, width: 250 }} size="small">
      <Button
        sx={{
          backgroundColor: "secondary.main",
          color: "white",
          textAlign: "center",
          borderRadius: "20px",
          width: "100%",
          height: 40,
          "&:hover": {
            backgroundColor: "secondary.dark",
          },
        }}
        onClick={() => setShowSlider(!showSlider)}
      >
        <Typography>
          {selectedMaxDistance > 0
            ? `0 - ${selectedMaxDistance} km`
            : "Distance"}
        </Typography>
      </Button>
      <Box
        sx={{
          mt: 1,
          height: 40,
          borderRadius: "20px",
          visibility: showSlider ? "visible" : "hidden",
          backgroundColor: "secondary.main",
          display: "flex",
          justifyContent: "space-between",
          paddingRight: "15px",
          paddingLeft: "60px",
          alignItems: "center",
        }}
      >
        <Slider
          value={selectedMaxDistance}
          onChange={(_, newValue: number | number[]) => {
            setSelectedMaxDistance(newValue as number);
            console.log("new MaxDistance", selectedMaxDistance);
          }}
          aria-labelledby="distance-slider"
          min={0}
          max={50}
          step={1}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value} km`}
          sx={{
            color: "common.white",
            "& .MuiSlider-thumb": {
              color: "common.white",
              border: "2px solid common.white",
              "&:focus, &:hover, &.Mui-focusVisible": {
                boxShadow: "none",
              },
            },
          }}
        />
        <IconButton onClick={() => setSelectedMaxDistance(0)}>
          <DeleteSharpIcon
            sx={{
              color: isMaxDistanceSelected()
                ? "common.white"
                : "secondary.main",
              marginLeft: "15px",
            }}
          />
        </IconButton>
      </Box>
    </FormControl>
  );
}

import { Box, Button, FormControl, Slider, Typography } from "@mui/material";
import { useState } from "react";

type DistanceFilterProps = {
  selectedMaxDistance: number;
  setSelectedMaxDistance: (selectedMaxDistance: number) => void;
};

export default function DistanceFilter({
  selectedMaxDistance,
  setSelectedMaxDistance,
}: DistanceFilterProps) {
  const [showSlider, setShowSlider] = useState(false);

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
          justifyContent: "center",
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
            width: "70%",
            color: "common.white",
            "& .MuiSlider-thumb": {
              color: "common.white",
              border: "2px solid common.white", // Ensure the border is white
              "&:focus, &:hover, &.Mui-focusVisible": {
                boxShadow: "none", // Remove the box shadow on focus
              },
            },
          }}
        />
      </Box>
    </FormControl>
  );
}

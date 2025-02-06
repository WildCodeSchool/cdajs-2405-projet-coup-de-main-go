import {
  Box,
  Chip,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

type DurationFilterProps = {
  selectedDurations: string[];
  setSelectedDurations: (selectedDurations: string[] | []) => void;
};

export default function DurationFilter({
  selectedDurations,
  setSelectedDurations,
}: DurationFilterProps) {
  // Set duration options
  const durationOptions = ["0 - 2h", "2h - 4h", "4h - 6h"];

  return (
    <FormControl sx={{ m: 1, width: 250 }} size="small">
      <Select
        multiple
        value={selectedDurations}
        onChange={(event) => {
          setSelectedDurations(event.target.value as string[]);
        }}
        displayEmpty
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <Typography>Durée</Typography>;
          }
          return (
            <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  sx={{
                    backgroundColor: "white",
                    color: "secondary.main",
                    fontWeight: "bold",
                    height: 23,
                  }}
                />
              ))}
            </Box>
          );
        }}
        sx={{
          backgroundColor: "secondary.main",
          color: "white",
          textAlign: "center",
          border: "none",
          borderRadius: "20px",
          "& .MuiSelect-icon": {
            color: "white",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&:hover": {
            backgroundColor: "secondary.dark",
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 1,
              borderRadius: "20px",
              backgroundColor: "secondary.main",
              color: "white",
            },
          },
        }}
      >
        {durationOptions.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              backgroundColor: "secondary.main",
              "&:hover": {
                backgroundColor: "secondary.light",
              },
              "&.Mui-selected": {
                backgroundColor: "secondary.dark",
                "&:hover": {
                  backgroundColor: "secondary.light",
                },
              },
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

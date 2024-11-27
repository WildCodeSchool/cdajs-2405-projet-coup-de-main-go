import { Box, TextField, IconButton } from "@mui/material";
import { Send } from "@mui/icons-material";


type ChatInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};

export function ChatInput({ value, onChange, onSubmit, onKeyDown }: ChatInputProps) {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        py: 1,
        px: 4,
        display: "flex",
        gap: 1,
      }}
    >
      <TextField
        fullWidth
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Entrez votre message..."
        variant="outlined"
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "var(--secondary)",
            },
          },
        }}
      />
      <IconButton
        type="submit"
        sx={{
          color: "var(--secondary)",
          borderRadius: "20%",
          "&:hover": {
            bgcolor: "var(--secondary)",
            color: "var(--white)",
          },
        }}
      >
        <Send />
      </IconButton>
    </Box>
  );
}

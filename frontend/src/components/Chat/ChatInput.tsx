import { Box, TextField, IconButton } from "@mui/material";
import { Send } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

type ChatInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onKeyDown,
}: ChatInputProps) {
  const theme = useTheme();

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
              borderColor: theme.palette.primary.main,
            },
          },
        }}
      />
      <IconButton
        type="submit"
        sx={{
          color: theme.palette.common.white,
          bgcolor: theme.palette.primary.main,
          borderRadius: "20%",
          "&:hover": {
            bgcolor: theme.palette.primary.dark,
          },
        }}
      >
        <Send />
      </IconButton>
    </Box>
  );
}

import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

type ChatActionButtonProps = {
  actions: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant?: "contained" | "outlined";
  }[];
};

export function ChatActionButton({ actions }: ChatActionButtonProps) {
  const theme = useTheme();

  const hasMultipleButtons = actions.length > 1;

  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        justifyContent: "center",
        borderBottom: 1,
        borderColor: "divider",
        gap: hasMultipleButtons ? 1 : 0,
      }}
    >
      {actions.map((action, index) => {
        const { variant = "contained", label, onClick, disabled } = action;

        return (
          <Button
            key={index}
            variant={variant}
            onClick={onClick}
            disabled={disabled}
            sx={{
              bgcolor:
                variant === "contained" ? theme.palette.primary.main : theme.palette.common.white,
              color:
                variant === "contained" ? theme.palette.common.white : theme.palette.primary.main,
              borderColor:
                variant === "outlined" ? theme.palette.primary.main : undefined,
              "&:hover": {
                bgcolor:
                  variant === "contained"
                    ? theme.palette.primary.dark
                    : theme.palette.grey[200],
              },
            }}
          >
            {label}
          </Button>
        );
      })}
    </Box>
  );
}

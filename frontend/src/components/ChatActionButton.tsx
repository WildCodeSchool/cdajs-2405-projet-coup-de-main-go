import { Box, Button } from "@mui/material";

type ChatActionButtonProps = {
  actions: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant?: "contained" | "outlined"
  }[];
};

export function ChatActionButton({ actions }: ChatActionButtonProps) {
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
              bgcolor: variant === "contained" ? "var(--secondary)" : "var(--white)",
              color: variant === "contained" ? "var(--white)" : "var(--secondary)",
              borderColor: variant === "outlined" ? "var(--secondary)" : undefined,
              "&:hover": {
                bgcolor: variant === "contained" ? "var(--secondary-hover)" : "var(--white-hover)",
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

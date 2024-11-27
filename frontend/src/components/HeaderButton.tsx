import { Box, Button } from "@mui/material";

type CustomButtonProps = {
  variant: "contained" | "outlined" | "text";
  color: string;
  text: string;
  icon?: string;
  onClick?: () => void;
};

export default function HeaderButton({
  variant,
  color,
  text,
  icon,
  onClick,
}: CustomButtonProps) {
  return (
    <Button
      variant={variant}
      sx={{
        bgcolor: color,
        "&:hover": { bgcolor: `${color}-hover` },
        mr: 1,
      }}
      onClick={onClick}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {icon && (
          <img src={icon} alt={text} style={{ width: 16, paddingRight: 4 }} />
        )}
        {text}
      </Box>
    </Button>
  );
}

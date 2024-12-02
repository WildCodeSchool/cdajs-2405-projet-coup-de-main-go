import { Box, Button } from "@mui/material";

type HeaderButtonProps = {
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
}: HeaderButtonProps) {
  const hoverColor = color.replace(")", "-hover)").replace(" ", ""); 

  return (
    <Button
      variant={variant}
      sx={{
        bgcolor: color,
        "&:hover": { bgcolor: hoverColor },
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

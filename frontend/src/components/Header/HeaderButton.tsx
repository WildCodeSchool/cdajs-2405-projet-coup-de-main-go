import { Box, Button } from "@mui/material";

type HeaderButtonProps = {
  color: "inherit" | "secondary" | "primary" | "warning" | "error" | "info" | "success";
  text: string;
  icon?: string;
  paddingX?: number;
  onClick?: () => void;
};

export default function HeaderButton({
  color,
  text,
  icon,
  paddingX,
  onClick,
}: HeaderButtonProps) {

  return (
    <Button
      color={color}
      sx={{
        paddingX: paddingX,
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

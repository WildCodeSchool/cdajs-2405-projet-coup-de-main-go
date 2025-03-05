import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

type HeaderButtonProps = {
  color:
    | "inherit"
    | "secondary"
    | "primary"
    | "warning"
    | "error"
    | "info"
    | "success";
  text: string;
  icon?: string;
  paddingX?: number;
  onClick?: () => void;
  to?: string;
};

export default function HeaderButton({
  color,
  text,
  icon,
  paddingX,
  onClick,
  to,
}: HeaderButtonProps) {
  return (
    <Button
      color={color}
      sx={{
        paddingX: paddingX,
      }}
      onClick={onClick}
      component={to ? Link : "button"}
      to={to}
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

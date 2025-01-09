import { useTheme, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";

export default function Logo() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Link to="/dashboard" style={{ textDecoration: "none", color: "inherit" }}>
      <img
        src="/images/logo_main_go.png"
        alt="Coup de main-go"
        style={{
          height: isMobile ? "60px" : "40px",
          width: isMobile ? "auto" : "auto",
          paddingTop: isMobile ? "10px" : "auto"
        }}
      />
    </Link>
  );
}

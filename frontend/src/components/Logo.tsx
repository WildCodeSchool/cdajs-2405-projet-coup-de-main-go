import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
      <img src="/logo.png" alt="Coup de main-go" height="40" />
    </Link>
  );
}

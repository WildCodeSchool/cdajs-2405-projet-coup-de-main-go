import { Button, Avatar } from "@mui/material";
import ProfileMenu from "./ProfileMenu";
import { useState } from "react";

interface DesktopMenuProps {
  onLogout: () => void;
}

export default function DesktopMenu({ onLogout }: DesktopMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        color="primary"
        startIcon={<Avatar sx={{ width: 24, height: 24 }} />}
        onClick={handleProfileClick}
      >
        Célia K.
      </Button>
      <ProfileMenu
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        onLogout={onLogout}
      />
    </>
  );
}

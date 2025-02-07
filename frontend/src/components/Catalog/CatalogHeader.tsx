import { Typography } from "@mui/material";

interface CatalogHeaderProps {
  selectedSkill: { id: string; name: string } | null;
}

export default function CatalogHeader({ selectedSkill }: CatalogHeaderProps) {
  return (
    <Typography variant="h4" sx={{ my: 3 }}>
      Catégorie {" > "}
      {selectedSkill ? selectedSkill.name : "Toutes les catégories"}
    </Typography>
  );
}

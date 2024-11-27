import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import type { AdCardType } from "../types";

interface AdCardProps {
  ad: AdCardType;
}

export default function AdCard({ ad }: AdCardProps) {
  return (
    <Card key={ad.id}>
      <CardHeader title={ad.title} />
      <CardContent>
        <Typography>Mangue(s) : {ad.mangoAmount}</Typography>
        <Typography>Statut de l'annonce : {ad.status}</Typography>
        {/* Utiliser date-fns pour formater les dates */}
        <Typography>
          Dernière mise à jour :{new Date(ad.updatedAt).toLocaleDateString()}
        </Typography>
        <Typography>Compétence requise : {ad.skill.name}</Typography>
        {/* A intégrer : photos de l'utilisateur et de la compétence */}
      </CardContent>
      <CardActions>
        <Button>Plus d'information</Button>
      </CardActions>
    </Card>
  );
}

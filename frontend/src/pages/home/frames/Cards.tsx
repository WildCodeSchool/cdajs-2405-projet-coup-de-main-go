import { Box, Stack, Grid2, Typography } from '@mui/material';
import Clique from "@public/images/undraw_undraw_favoritepost_r6a0_-2-_oohm.svg";
import Recevoir from "@public/images/undraw_verified_re_4io7.svg";
import Discute from "@public/images/undraw_mobile_message.svg";
import Train from "@public/images/undraw_personal_trainer_re_cnua.svg";
import '../home.css';

interface CardProps {
  title: string;
  image: string;
  className?: string; // Utilisation de className
}

function Card({ title, image, className }: CardProps) {
  return (
    <Stack className={`card ${className}`}>
      <Box
        component="img"
        src={image}
        alt=""
        sx={{ maxWidth: "300px" }}
      />
      <Typography variant="body1" textAlign="center" fontWeight={700} lineHeight={0} fontSize={20}>{title}</Typography>
    </Stack>
  );
}

export default function Frames() {
  const cardsData = [
    { title: "Cliquez sur vos annonces", image: Clique, className: "intro-img" },
    { title: "Discuter ensemble", image: Discute, className: "intro-img" },
    { title: "Rejoignez le point d'aide", image: Train, className: "intro-img" },
    { title: "Recevez vos mangues", image: Recevoir, className: "intro-img img-4" },
  ];

  return (
    <Grid2 container spacing={9} justifyContent="center" alignItems="flex-end">
      {cardsData.map((card, index) => (
        <Card 
          key={index} 
          title={card.title} 
          image={card.image} 
          className={card.className} 
        />
      ))}
    </Grid2>
  );
}

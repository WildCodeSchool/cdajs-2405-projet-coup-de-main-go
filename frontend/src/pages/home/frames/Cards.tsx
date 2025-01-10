import {
    Box,
    Stack,
    Grid2,
    Typography,
    useTheme,
    useMediaQuery,
} from "@mui/material";

import Clique from "/images/undraw_undraw_favoritepost_r6a0_-2-_oohm.svg";
import Discute from "/images/undraw_mobile_message.svg";
import Recevoir from "/images/undraw_verified_re_4io7.svg";
import Right from "/images/right.svg";
import Train from "/images/undraw_personal_trainer_re_cnua.svg";

import "../home.css";

interface CardProps {
    title: string;
    image: string;
    className?: string; // Utilisation de className
}

function Card({ title, image, className }: CardProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Stack className={`card ${className}`}>
            {isMobile ? (
                <Box
                    component="img"
                    src={image}
                    alt=""
                    sx={{
                        maxWidth: "250px",
                    }}
                />
            ) : (
                <Box
                    component="img"
                    src={image}
                    alt=""
                    sx={{ maxWidth: "300px" }}
                />
            )}
            <Typography
                variant="body1"
                textAlign="center"
                fontWeight={700}
                lineHeight={0}
                fontSize={20}
            >
                {title}
            </Typography>
        </Stack>
    );
}

export default function Frames() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const cardsData = [
        {
            title: "Cliquez sur vos annonces",
            image: Clique,
            className: "intro-img",
        },
        ...(isMobile
            ? [
                  {
                      title: "",
                      image: Right,
                      className: "intro-chevron",
                  },
              ]
            : []),
        {
            title: "Discuter ensemble",
            image: Discute,
            className: "intro-img",
        },
        ...(isMobile
            ? [
                  {
                      title: "",
                      image: Right,
                      className: "intro-chevron",
                  },
              ]
            : []),
        {
            title: "Rejoignez le point d'aide",
            image: Train,
            className: "intro-img",
        },
        ...(isMobile
            ? [
                  {
                      title: "",
                      image: Right,
                      className: "intro-chevron",
                  },
              ]
            : []),
        {
            title: "Recevez vos mangues",
            image: Recevoir,
            className: "intro-img img-4",
        },
    ];

    return (
        <>
            {isMobile ? (
                <Stack
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-end",
                        gap: "32px",
                        overflowX: "scroll",
                        height: "300px",
                        paddingX: "32px",
                        paddingBottom: "64px",
                    }}
                >
                    {cardsData.map((card, index) => (
                        <Card
                            key={index}
                            title={card.title}
                            image={card.image}
                            className={card.className}
                        />
                    ))}
                </Stack>
            ) : (
                <Grid2
                    container
                    spacing={9}
                    justifyContent="center"
                    alignItems="flex-end"
                >
                    {cardsData.map((card, index) => (
                        <Card
                            key={index}
                            title={card.title}
                            image={card.image}
                            className={card.className}
                        />
                    ))}
                </Grid2>
            )}
        </>
    );
}

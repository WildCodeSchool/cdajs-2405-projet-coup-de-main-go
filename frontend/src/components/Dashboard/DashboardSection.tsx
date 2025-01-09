import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useGetAllAdsQuery } from "../../generated/graphql-types";
import { AdCardType } from "../../types";
import theme from "../../mui";
import AdCard from "./AdCard";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface DashboardSectionProps {
  title: string;
  skillId: string;
}

export default function DashboardSection({
  title,
  skillId,
}: DashboardSectionProps) {
  const isSwippable = useMediaQuery("(max-width: 1400px)");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    loading: adsLoading,
    error: adsError,
    data: adsData,
  } = useGetAllAdsQuery({
    variables: {
      skillId: skillId,
      limit: 4,
    },
  });

  if (adsLoading) return <CircularProgress />;
  if (adsError) return <p>Error: {adsError.message}</p>;
  if (!adsData) return <Typography>Aucune donnée trouvée</Typography>;

  const adCards: AdCardType[] = adsData?.getAllAds;

  console.log("adCards", adCards);

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontSize: isMobile ? "1.5rem" : "3rem",
            fontWeight: "600",
          }}
        >
          {title}
        </Typography>

        {isSwippable ? (
          // Mode mobile avec Swiper

          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            breakpoints={{
              320: { slidesPerView: 1 },
              750: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
            style={
              {
                margin: "1rem 0",
                width: "100%",
                "--swiper-navigation-color": "#949E80",
                "--swiper-navigation-size": "30px",
              } as React.CSSProperties
            }
            navigation
          >
            {adCards.map((ad: AdCardType) => (
              <SwiperSlide
                key={ad.id}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AdCard ad={ad} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          // Mode desktop
          <Stack
            spacing={6}
            direction="row"
            sx={{
              justifyContent: "start",
              width: "100%",
              margin: "2rem 0",
            }}
          >
            {adCards.map((ad: AdCardType) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </Stack>
        )}

        <Button sx={{ marginBottom: "3rem", paddingX: 4 }}>
          Afficher plus
        </Button>
      </Box>
    </>
  );
}

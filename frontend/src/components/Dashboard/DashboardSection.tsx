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
import { useGetAllAdsQuery, Status } from "../../generated/graphql-types";
import { AdCardType } from "../../types";
import theme from "../../mui";
import AdCard from "../AdCard/AdCard";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";

interface DashboardSectionProps {
  title: string;
  skillId?: string;
}

export default function DashboardSection({
  title,
  skillId,
}: DashboardSectionProps) {
  const navigate = useNavigate();
  const isSwippable = useMediaQuery("(max-width: 1400px)");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    loading: adsLoading,
    error: adsError,
    data: adsData,
  } = useGetAllAdsQuery({
    variables: {
      skillId: skillId || null,
      limit: 4,
      status: Status.Posted,
    },
  });

  if (adsLoading) return <CircularProgress />;
  if (adsError) return <p>Error: {adsError.message}</p>;
  if (!adsData) return <Typography>Aucune donnée trouvée</Typography>;

  const adCards: AdCardType[] = adsData?.getAllAds;

  const handleClick = () => {
    const skillData = { id: skillId, name: title };
    navigate("/catalog", {
      state: { skill: skillData },
    });
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontSize: isMobile ? 32 : 48,
            fontWeight: "600",
            textAlign: isMobile ? "center" : "start",
          }}
        >
          {title}
        </Typography>

        {isSwippable ? (
          // Mobile display with Swiper
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
                "--swiper-navigation-color": "var(--tertiary)",
                "--swiper-navigation-size": "2rem",
              } as React.CSSProperties
            }
            navigation
          >
            {adCards.map((ad) => (
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
          // Screen above 1400px display without Swiper
          <Stack
            spacing={6}
            direction="row"
            sx={{
              justifyContent: "start",
              width: "100%",
              marginY: 4,
            }}
          >
            {adCards.map((ad: AdCardType) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </Stack>
        )}

        <Stack
          sx={{
            marginBottom: 6,
            alignItems: isMobile ? "center" : "flex-start",
          }}
        >
          <Button
            sx={{
              paddingX: 4,
            }}
            onClick={handleClick}
          >
            Afficher plus
          </Button>
        </Stack>
      </Box>
    </>
  );
}

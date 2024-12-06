import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Box } from "@mui/material";
import "./DetailAdSlider.css";

export default function DetailAdSlider() {
  // Images à utiliser
  const image1 =
    "https://plus.unsplash.com/premium_photo-1678652879556-11451dff2f6a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const image2 =
    "https://images.unsplash.com/photo-1534811939961-e17907ba11c4?q=80&w=2126&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const image3 =
    "https://plus.unsplash.com/premium_photo-1678382341022-0d8a8765f141?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <Box
      sx={{
        width: "100%",
        height: "14rem",
        borderRadius: "1rem 1rem 0 0",
      }}
    >
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        loop={false}
        style={{ width: "100%", height: "100%" }}
      >
        <SwiperSlide>
          <img
            src={image1}
            alt={"photo de l'annonce"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              borderRadius: "1rem 1rem 0 0",
            }}
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={image2}
            alt={"photo de l'annonce"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "1rem 1rem 0 0",
            }}
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={image3}
            alt={"photo de l'annonce"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "1rem 1rem 0 0",
            }}
          />
        </SwiperSlide>
      </Swiper>
    </Box>
  );
}

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./DetailAdSlider.css";
import { GetAdByIdQuery } from "../../generated/graphql-types";

interface DetailAdSliderProps {
  ad: GetAdByIdQuery["getAdById"];
}

export default function DetailAdSlider({ ad }: DetailAdSliderProps) {
  return (
    <Swiper
      modules={[Pagination]}
      pagination={{ clickable: true }}
      loop={false}
      style={{ width: "100%", height: "100%" }}
    >
      {ad.picture1 && (
        <SwiperSlide>
          <img
            src={`${import.meta.env.VITE_DOMAIN_BACKEND_URL}/uploads/ads/${
              ad.id
            }/${ad.picture1}`}
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
      )}

      {ad.picture2 && (
        <SwiperSlide>
          <img
            src={`${import.meta.env.VITE_DOMAIN_BACKEND_URL}/uploads/ads/${
              ad.id
            }/${ad.picture2}`}
            alt={"photo de l'annonce"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "1rem 1rem 0 0",
            }}
          />
        </SwiperSlide>
      )}

      {ad.picture3 && (
        <SwiperSlide>
          <img
            src={`${import.meta.env.VITE_DOMAIN_BACKEND_URL}/uploads/ads/${
              ad.id
            }/${ad.picture3}`}
            alt={"photo de l'annonce"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "1rem 1rem 0 0",
            }}
          />
        </SwiperSlide>
      )}
    </Swiper>
  );
}

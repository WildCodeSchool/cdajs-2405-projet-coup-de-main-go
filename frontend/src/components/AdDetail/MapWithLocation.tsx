import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapWithLocationProps {
  latitude: number;
  longitude: number;
}

export default function MapWithLocation({
  latitude,
  longitude,
}: MapWithLocationProps) {
  const position = [latitude, longitude] as [number, number];

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "12.5rem", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Circle center={position} radius={500} pathOptions={{ color: "red" }} />
    </MapContainer>
  );
}

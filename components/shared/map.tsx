import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { itemData } from "@/types";

interface MapProps {
  position: [number, number];
  zoom: number;
  items: itemData[];
}

const Map = ({ position, zoom, items }: MapProps) => {
  return (
    <MapContainer
      className="h-full w-full"
      center={position}
      zoom={zoom}
      scrollWheelZoom
      zoomControl
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {items.map((item) => (
        <Marker key={item.id} position={[item.latitude, item.longitude]}>
          <Popup>
            <strong>{item.title} | <span className={`${item.status === "hilang" ? "text-red-500" : "text-green-500"}`}>{item.status}</span></strong>
            <br />
            {item.location_text}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;

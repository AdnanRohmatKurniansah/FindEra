import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { itemData } from "@/types";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface MapProps {
  position: [number, number];
  zoom: number;
  items: itemData[];
}

const statusConfig = {
  ditemukan: {
    label: "Ditemukan",
    className: "bg-[#DCFCE7] border border-primary text-primary",
  },
  ditutup: {
    label: "Ditutup",
    className: "bg-[#FFFBEB] border border-[#78350F] text-[#78350F]",
  },
  diklaim: {
    label: "Diklaim",
    className: "bg-blue-200 border border-blue-500 text-blue-500",
  },
  hilang: {
    label: "Hilang",
    className: "bg-[#FFF2F3] border border-[#FB2C36] text-[#FB2C36]",
  },
} as const;

type StatusKey = keyof typeof statusConfig;

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
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {items.map((item) => {
        const statusKey = item.status as StatusKey;
        const status = statusConfig[statusKey];

        return (
          <Marker key={item.id} position={[item.latitude, item.longitude]}>
            <Popup>
              <strong>
                <Link className="text-black" href={`/item/${item.id}`}>
                  {item.title}
                </Link>
                {status && (
                  <Badge className={`ms-2 rounded-xl text-[9px] md:text-[12px] px-2 py-1 ${status.className}`}>
                    {status.label}
                  </Badge>
                )}
              </strong>
              <br />
              <span>{item.location_text}</span>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;

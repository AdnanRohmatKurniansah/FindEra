import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

interface MapProps {
  position: [number, number];
  zoom: number;
}

const Map = ({ position, zoom }: MapProps) => {
  return <MapContainer className="h-full w-full" center={position} zoom={zoom} scrollWheelZoom={true} zoomControl={true}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={position}>
      <Popup>
        Halo Bang
      </Popup>
    </Marker>
  </MapContainer>
}

export default Map;
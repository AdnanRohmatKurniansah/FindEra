"use client"

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/images/leaflet/marker-icon-2x.png",
  iconUrl: "/images/leaflet/marker-icon.png",
  shadowUrl: "/images/leaflet/marker-shadow.png",
})

type Props = {
  lat: number
  lng: number
  onChange: (lat: number, lng: number) => void
}

const LocationMarker = ({ lat, lng, onChange }: Props) => {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng)
    },
  })

  return <Marker position={[lat, lng]} />
}

export default function LocationPicker({ lat, lng, onChange }: Props) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={17}
      maxZoom={18}
      scrollWheelZoom
      style={{ height: "300px", width: "100%" }}
      className="z-40"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker lat={lat} lng={lng} onChange={onChange} />
    </MapContainer>
  )
}

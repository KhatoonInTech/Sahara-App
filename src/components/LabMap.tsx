import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Lab {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

const mockLabs: Lab[] = [
  { id: 1, name: "City Diagnostic Center", lat: 31.5204, lng: 74.3587, address: "Lahore, Pakistan" },
  { id: 2, name: "Hope Medical Lab", lat: 31.5580, lng: 74.3507, address: "Gulberg, Lahore" },
  { id: 3, name: "Trust Pathology Lab", lat: 31.4800, lng: 74.3200, address: "Model Town, Lahore" },
  { id: 4, name: "SafeCare Testing", lat: 31.5100, lng: 74.3400, address: "Jail Road, Lahore" },
];

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

export default function LabMap() {
  const [position, setPosition] = useState<[number, number]>([31.5204, 74.3587]); // Default to Lahore
  const [hasLocation, setHasLocation] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setHasLocation(true);
        },
        () => {
          // Silently fail and use default position
          setHasLocation(false);
        }
      );
    }
  }, []);

  return (
    <div className="h-64 w-full rounded-2xl overflow-hidden border border-text-muted/10 shadow-inner bg-section-bg relative z-0">
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hasLocation && (
          <Marker position={position}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        {mockLabs.map(lab => (
          <Marker key={lab.id} position={[lab.lat, lab.lng]}>
            <Popup>
              <div className="p-1">
                <h4 className="font-bold text-xs">{lab.name}</h4>
                <p className="text-[10px] opacity-70">{lab.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        <ChangeView center={position} />
      </MapContainer>
      {!hasLocation && (
        <div className="absolute bottom-2 left-2 z-[1000] bg-white/80 dark:bg-black/80 px-2 py-1 rounded text-[10px] font-medium">
          Showing default area (Lahore)
        </div>
      )}
    </div>
  );
}

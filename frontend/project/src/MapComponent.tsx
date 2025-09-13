import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import socket from './socket.ts'; // adjust path to your socket setup

// Fix marker icon issue with Leaflet in React
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type Coordinates = {
  latitude: number;
  longitude: number;
};

interface LiveMapProps {
  sourceCoords: Coordinates;
  destinationCoords: Coordinates;
  shipId: string;
}

const LiveMap: React.FC<LiveMapProps> = ({ sourceCoords, destinationCoords, shipId }) => {
  const [currentCoords, setCurrentCoords] = useState<Coordinates | null>(null);

  useEffect(() => {
    const handleLocationUpdate = (data: any) => {
      if (data.shipId === shipId) {
        console.log("📍 Map received live location:", data);
        setCurrentCoords({ latitude: data.latitude, longitude: data.longitude });
      }
    };

    socket.on('shipLocationUpdate', handleLocationUpdate);

    return () => {
      socket.off('shipLocationUpdate', handleLocationUpdate);
    };
  }, [shipId]);


  const center = currentCoords ?? sourceCoords;

  const createCustomIcon = (color: string, withPulse = false) =>
    L.divIcon({
      className: 'custom-div-icon',
      html: `
      <div class="marker-wrapper">
        <div class="marker-dot ${color} ${withPulse ? 'pulse' : ''}"></div>
      </div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

  const sourceIcon = createCustomIcon('bg-blue-500');
  const destinationIcon = createCustomIcon('bg-green-500');
  const liveIcon = createCustomIcon('bg-red-500', true); // pulsing for live





  return (
    <MapContainer center={[center.latitude, center.longitude]} zoom={6} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={[sourceCoords.latitude, sourceCoords.longitude]} icon={sourceIcon}>
        <Popup>Source Port</Popup>
      </Marker>

      <Marker position={[destinationCoords.latitude, destinationCoords.longitude]} icon={destinationIcon}>
        <Popup>Destination Port</Popup>
      </Marker>

      {currentCoords && (
        <Marker position={[currentCoords.latitude, currentCoords.longitude]} icon={liveIcon}>
          <Popup>Live Ship Location</Popup>
        </Marker>

      )}
    </MapContainer>
  );
};

export default LiveMap;

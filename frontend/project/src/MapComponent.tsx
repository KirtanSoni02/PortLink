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
    socket.on('shipLocationUpdate', (data: any) => {
      if (data.shipId === shipId) {
        setCurrentCoords({ latitude: data.latitude, longitude: data.longitude });
      }
    });

    return () => {
      socket.off('shipLocationUpdate');
    };
  }, [shipId]);

  const center = currentCoords ?? sourceCoords;

  return (
    <MapContainer center={[center.latitude, center.longitude]} zoom={6} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={[sourceCoords.latitude, sourceCoords.longitude]}>
        <Popup>Source Port</Popup>
      </Marker>

      <Marker position={[destinationCoords.latitude, destinationCoords.longitude]}>
        <Popup>Destination Port</Popup>
      </Marker>

      {currentCoords && (
        <Marker position={[currentCoords.latitude, currentCoords.longitude]}>
          <Popup>Live Ship Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default LiveMap;

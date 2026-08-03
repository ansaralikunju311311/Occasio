import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

type Props = {
  lat: number;
  lng: number;
  locationName: string;
};

const EventMap = ({ lat, lng, locationName }: Props) => {
  const centerPos = [lat, lng] as [number, number];

  return (
    <MapContainer
      {...({ center: centerPos, zoom: 15, style: { height: '100%', width: '100%' } } as unknown as Record<string, unknown>)}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={centerPos as unknown as [number, number]}>
        <Popup>{locationName}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default EventMap;

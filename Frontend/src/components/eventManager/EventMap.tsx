import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

type Props = {
  lat: number;
  lng: number;
  locationName: string;
};

const EventMap = ({ lat, lng, locationName }: Props) => {


  
  return (
    <MapContainer
      {...{ center: [lat, lng], zoom: 15 } as any}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[lat, lng] as any}>
        <Popup>{locationName}</Popup>
      </Marker>
    </MapContainer>

  );
};

export default EventMap;
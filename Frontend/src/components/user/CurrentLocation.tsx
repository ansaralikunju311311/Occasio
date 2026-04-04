import { useEffect, useState } from "react";
import axios from "axios";

const CurrentLocation = () => {
  const [location, setLocation] = useState("Detecting location...");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;


        console.log("lat",lat, "lng0",lng)

        try {
          const res = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=70d46cbbe84049af91ecc6f7e4e1b48a`
          );

          const c = res.data.results[0]?.components;

          const name = [
            c.city || c.town || c.village,
            c.state,
            c.country
          ]
            .filter(Boolean)
            .join(", ");

          setLocation(name);
        } catch {
          setLocation("Unable to fetch location");
        }
      },
      () => {
        setLocation("Permission denied");
      },
      {
        enableHighAccuracy: true
      }
    );
  }, []);

  return <p>📍 {location}</p>;
};

export default CurrentLocation;
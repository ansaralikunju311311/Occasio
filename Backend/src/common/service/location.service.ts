 import axios from "axios";

// export const getLocationName = async (lat: number, lng: number) => {
// //   const apiKey = "YOUR_OPENCAGE_API_KEY";

//   const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${process.env.API_KEY}`;

//   const res = await axios.get(url);

//   return res.data.results[0]?.formatted;
// };


// import axios from "axios";

// const API_KEY = import.meta.env.VITE_OPENCAGE_KEY;

// // 🔹 1. lat/lng → location name
// export const getLocationName = async (lat: number, lng: number) => {
//   try {
//     const res = await axios.get(
//       `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${API_KEY}`
//     );

//     const result = res.data.results[0];
//     if (!result) return "Unknown Location";

//     const c = result.components;

//     return [
//       c.road,
//       c.suburb || c.neighbourhood,
//       c.city || c.town || c.village,
//       c.state,
//       c.country
//     ]
//       .filter(Boolean)
//       .join(", ");

//   } catch {
//     return "Unknown Location";
//   }
// };


// 🔹 2. location name → lat/lng
export const getLocationName = async (adress: string) => {
  try {
    const res = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${adress}&key=${process.env.API_KEY}`
    );

    const result = res.data.results[0];
    if (!result) return null;

    return {
      latitude: result.geometry.lat,
      longitude: result.geometry.lng,
      formatted: result.formatted
    };

  } catch {
    return null;
  }
};
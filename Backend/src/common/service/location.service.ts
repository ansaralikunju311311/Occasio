import axios from "axios";

export const getLocationName = async (lat: number, lng: number) => {
//   const apiKey = "YOUR_OPENCAGE_API_KEY";

  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${process.env.API_KEY}`;

  const res = await axios.get(url);

  return res.data.results[0]?.formatted;
};
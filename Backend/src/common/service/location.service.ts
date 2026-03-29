 import axios from "axios";
export const getLocationName = async (address: string) => {
  try {
    const res = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${address}&key=${process.env.API_KEY}`
    );

    const results = res.data.results;

    if (!results || results.length === 0) return null;

    //  Prefer high confidence result
    const bestResult = results.find(r => r.confidence >= 8) || results[0];

    return {
      latitude: bestResult.geometry.lat,
      longitude: bestResult.geometry.lng,
      formatted: bestResult.formatted
    };

  } catch {
    return null;
  }
};
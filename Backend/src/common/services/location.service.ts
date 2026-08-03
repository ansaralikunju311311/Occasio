import axios from 'axios';

interface OpenCageResult {
  confidence: number;
  geometry: {
    lat: number;
    lng: number;
  };
  formatted: string;
}

export const getLocationName = async (address: string) => {
  try {
    const res = await axios.get<{ results: OpenCageResult[] }>(
      `https://api.opencagedata.com/geocode/v1/json?q=${address}&key=${process.env.API_KEY}`,
    );

    const results = res.data.results;

    if (!results || results.length === 0) {
      return null;
    }

    const bestResult =
      results.find((r: OpenCageResult) => r.confidence >= 8) || results[0];
    return {
      latitude: bestResult.geometry.lat,
      longitude: bestResult.geometry.lng,
      formatted: bestResult.formatted,
    };
  } catch {
    return null;
  }
};

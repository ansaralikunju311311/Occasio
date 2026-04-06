export const normalizeCoordinates = (longitude: number, latitude: number) => {
  return {
    longitude: Number(longitude),
    latitude: Number(latitude),
  };
};
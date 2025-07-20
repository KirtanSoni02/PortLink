export const calculateSpeed = (start, end, lastTimestamp) => {
  const distance = haversineDistance(start, end); // in km
  const timeHours = (Date.now() - lastTimestamp) / (1000 * 60 * 60); // convert ms to hours
  return distance / timeHours; // km/h
};

// Helper function: haversine formula
export const haversineDistance = (coord1, coord2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);
  const lat1 = toRad(coord1.lat);
  const lat2 = toRad(coord2.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const toRad = (value) => (value * Math.PI) / 180;

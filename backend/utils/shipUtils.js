export const getWeatherStatus = async (portName) => {
  // For now return random status or mock logic
  const statuses = ['Clear', 'Cloudy', 'Stormy', 'Foggy'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export const calculateDistance = (source, destination) => {
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRadians(destination.lat - source.lat);
  const dLon = toRadians(destination.lng - source.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(source.lat)) *
      Math.cos(toRadians(destination.lat)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;
  const distanceNautical = distanceKm * 0.539957; // km to nautical miles

  return distanceNautical;
};

export const calculateETA = (distanceInNauticalMiles, speedInKnots) => {
  const hours = distanceInNauticalMiles / speedInKnots;
  const eta = new Date();
  eta.setHours(eta.getHours() + hours);
  return eta;
};

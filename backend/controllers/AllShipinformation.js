import Ship from "../models/Ship.model.js";

export const getAllShipInformation = async (req, res, next) => {
  try {
    const ships = await Ship.find({ status: "active" });

    const data = ships.map((ship) => {
      let statusStr = "sailing";
      if (ship.currentspeed === 0 || ship.progress === 0) {
        statusStr = "docked";
      } else if (ship.currentspeed > 0 && ship.currentspeed < 3) {
        statusStr = "anchored";
      }

      return {
        id: ship._id.toString(),
        name: ship.name,
        lat: ship.currentLocation?.lat ?? 18.9667,
        lng: ship.currentLocation?.lng ?? 72.8333,
        status: statusStr,
        speed: ship.currentspeed ?? 15,
        heading: 120,
        destination: ship.destination || "Port Terminal",
        eta: ship.eta ? new Date(ship.eta).toLocaleDateString() : "In Transit",
        flag: "🇮🇳 India",
        vesselType: ship.cargoType || "Container Vessel",
        weather: ship.weatherStatus ? `Weather: ${ship.weatherStatus}` : "Clear Skies",
      };
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching telemetry ships:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

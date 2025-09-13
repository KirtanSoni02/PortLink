import Ship from "../models/Ship.model.js";

export const getAllShipInformation = async (req, res, next) => {
  try {
    const ships = await Ship.find({ status: "active" }); // Use find() for Mongoose

    const data = ships.map((ship) => ({
      id: ship._id,
      name: ship.name,
      lat: ship.currentLocation?.lat ?? 0,
      lng: ship.currentLocation?.lng ?? 0,
      status: ship.status, // Maybe use ship.status === 'active' ? 'sailing' : 'docked' if needed
      speed: ship.currentspeed ?? 0,
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching ships:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

import mongoose from 'mongoose';
import Ship from '../models/Ship.model.js';
import PortAuthority from '../models/PortAuthority.model.js'; // import this

export const getActiveShipsByPort = async (req, res,next) => {
  try {
    const userId = req.user.id;

    // Step 1: Find PortAuthority by user ID
    const portAuthority = await PortAuthority.findOne({ user: userId });
    console.log("PortAuthority found:", portAuthority);
    if (!portAuthority) {
      return res.status(404).json({ error: "PortAuthority not found" });
    }

    const portId = portAuthority._id;

    // Step 2: Find all ships created by this port
    const ships = await Ship.find({
  createdBy: portAuthority._id,
  status: 'active',
}).populate({
  path: 'crew.sailorId',
  populate: {
    path: 'user', // from sailor model
    model: 'User', // explicitly mention if needed
  }
});


    res.status(200).json(ships);
  } catch (error) {
    console.error("Error fetching ships:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const getIncomingShipsToPort = async (req, res, next) => {
  try {
    const userId = req.user.id;
console.log("req.user.id (from JWT):", req.user.id);

    // Step 1: Find PortAuthority by user ID
    const portAuthority = await PortAuthority.findOne({ user: userId });
    console.log("PortAuthority found:", portAuthority);
    if (!portAuthority) {
      return res.status(404).json({ error: "PortAuthority not found" });
    }

    const portId = portAuthority._id;

    // Step 2: Find all ships created by this port
    const ships = await Ship.find({
  destinationPort: portAuthority.portName,
  status: 'active',
});
console.log("Ships found:", ships);

    res.status(200).json(ships);
  } catch (error) {
    console.error("Error fetching ships:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};















// controllers/shipController.js
// import Ship from "../models/Ship.js"; // adjust path
import axios from "axios";

export const updateSailorLocation = async ({ shipId, latitude, longitude}) => {
  try {
    // Fetch the ship from DB
    const ship = await Ship.findById(shipId);
    if (!ship) {
      console.log("🚫 Ship not found!");
      return;
    }

    const prevLocation = ship.currentLocation;

    // Calculate speed (optional)
    const distance = calculateDistance(
      prevLocation.lat,
      prevLocation.lng,
      latitude,
      longitude
    );
    const speed = distance / (10 / 60); // distance per 10 mins in km/hr

    // // Fetch weather
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}`
    );
    const weather = weatherResponse.data.weather[0].description;
    const region = weatherResponse.data.name
    // Update ship
    ship.currentLocation = { lat: latitude, lng: longitude, region: region};
    ship.speed = speed;
    ship.weatherStatus = weather;

    await ship.save();
    console.log("✅ Ship updated successfully.");
  } catch (err) {
    console.error("❌ Error updating ship:", err);
  }
};

// Haversine Distance Function
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

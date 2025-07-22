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
  source: portAuthority.portName, // Assuming portName is the field in Ship model
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



// export const getIncomingShipsToPort = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
// console.log("req.user.id (from JWT):", req.user.id);

//     // Step 1: Find PortAuthority by user ID
//     const portAuthority = await PortAuthority.findOne({ user: userId });
//     console.log("PortAuthority found for incoming ships:", portAuthority);
//     if (!portAuthority) {
//       return res.status(404).json({ error: "PortAuthority not found" });
//     }

//     const portId = portAuthority._id;

//     // Step 2: Find all ships created by this port
//     const ships = await Ship.find({
//   destination: portAuthority.portName,
//   status: 'active',
// });
// console.log("Ships found:", ships);

//     res.status(200).json(ships);
//   } catch (error) {
//     console.error("Error fetching ships:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



import CompletedContract from "../models/CompletedContract.model.js";


export const getIncomingShipsToPort = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log("req.user.id (from JWT):", req.user.id);

    const portAuthority = await PortAuthority.findOne({ user: userId });
    console.log("PortAuthority found for incoming ships:", portAuthority);

    if (!portAuthority) {
      return res.status(404).json({ error: "PortAuthority not found" });
    }

    const activeShips = await Ship.find({
      destination: portAuthority.portName,
      status: "active"
    });

    console.log("Active Ships found:", activeShips);

    for (const ship of activeShips) {
      if (ship.progress >= 100) {
        // Prepare completed contract data
        const completedData = {
          portAuthority: ship.createdBy._id,
          ship: ship._id,
          shipNumber: ship.number,
          shipName: ship.name,
          startDate: ship.departureDate,
          endDate: new Date(), // or ship.arrivalDate if present
          sailorsCount: ship.crewCount,
          crew: ship.crew?.map(c => ({
            sailorId: c.sailorId,
            name: c.name || "",
            role: c.role || "",
            experience: c.experience || ""
          })) || [],
          route: {
            source: ship.source,
            destination: ship.destination
          },
          cargoType: ship.cargoType,
          totalPayment: ship.salary * ship.crewCount || 0,
          duration: `${Math.ceil((Date.now() - new Date(ship.departureDate).getTime()) / (1000 * 60 * 60 * 24))} days`,
        };

        // Save to completed contracts
        await CompletedContract.create(completedData);

        // Delete ship
        await Ship.findByIdAndDelete(ship._id);

        console.log(`Ship ${ship.name} archived to CompletedContracts.`);
      }
    }

    // After archiving, get the fresh list again
    const remainingActiveShips = await Ship.find({
      destination: portAuthority.portName,
      status: "active"
    });

    res.status(200).json(remainingActiveShips);
  } catch (error) {
    console.error("Error processing ships:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};









import portLocation from '../portLocations.js';

import axios from "axios";
import { parse } from 'path';

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
    const rawSourceCoords = portLocation[ship.source];
    const rawDestinationCoords = portLocation[ship.destination];
console.log("Raw source coordinates:", rawSourceCoords);
console.log("Raw destination coordinates:", rawDestinationCoords);

const sourceCoords = {
  lat: parseFloat(rawSourceCoords.latitude),
  lng: parseFloat(rawSourceCoords.longitude),
};

const destinationCoords = {
  lat: parseFloat(rawDestinationCoords.latitude),
  lng: parseFloat(rawDestinationCoords.longitude),
};

    const totalDistance = calculateDistance(
  sourceCoords.lat, sourceCoords.lng,
  destinationCoords.lat, destinationCoords.lng
);

if (totalDistance === 0) {
  ship.progress = 100;
} else {
  const traveled = calculateDistance(
    sourceCoords.lat, sourceCoords.lng,
    latitude, longitude
  );
  ship.progress = (traveled / totalDistance) * 100;
  ship.progress = Math.round(ship.progress * 10) / 10; // ✅ round to 1 decimal place
}


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

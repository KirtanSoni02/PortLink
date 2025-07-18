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
    getUpdatedShips(req); // Call the function to update ship locations
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
    getUpdatedShips(req);
  } catch (error) {
    console.error("Error fetching ships:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const getUpdatedShips = async (req) => {
  try {
    const userId = req.user.id; 
    const portAuthority = await PortAuthority.findOne({ user: userId });

    const ships = await Ship.find({ createdBy: portAuthority._id, status: 'active' });
   
    
    
    // Perform your ship update logic here (e.g., update location, status, etc.)
  } catch (error) {
    console.error("Error updating ship locations (background):", error);
  }
};

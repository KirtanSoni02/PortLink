import express from 'express';
import JobPost from '../models/JobPost.model.js';
import Ship from '../models/Ship.model.js';
export const getMyJobPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const portAuthority = await PortAuthority.findOne({ user: userId });

        if (!portAuthority) {
          return res.status(404).json({ error: "PortAuthority not found" });
        }
    
        const portId = portAuthority._id;
    const jobPosts = await JobPost.find({ createdBy: portId }).sort({ createdDate: -1 });
    res.status(200).json(jobPosts);
    
  } catch (err) {
    console.error("Failed to fetch job posts:", err);
    res.status(500).json({ message: "Server error" });
  }
}

import PortAuthority from "../models/PortAuthority.model.js";
import {calculateSpeed,haversineDistance} from "../utils/calculateSpeed.js";
import { getWeatherData } from '../utils/weatherAPI.js';
import portLocation from "../portLocations.js"


export function calculateETA(distanceInKm, speedInKnots = 20) {
  if (!distanceInKm || isNaN(distanceInKm) || !speedInKnots || isNaN(speedInKnots)) {
    console.error("Invalid distance or speed:", { distanceInKm, speedInKnots });
    return null;
  }

  const speedInKmH = speedInKnots * 1.852;
  if (speedInKmH === 0) return null;

  const hours = distanceInKm / speedInKmH;
  if (!isFinite(hours)) return null;

  const eta = new Date();
  eta.setHours(eta.getHours() + hours);

  if (isNaN(eta.getTime())) {
    console.error("Invalid ETA Date generated");
    return null;
  }

  return eta;
}


export const ConvertToShip = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const portAuthorityId = await PortAuthority.findOne({ user: userId });
    console.log("Converting job posts to ships for Port Authority ID:", portAuthorityId);
        const portId = portAuthorityId._id;

    const jobPosts = await JobPost.find({ createdBy: portId, status: 'active' }); 
 
    for (const job of jobPosts) {
      const departureDate = new Date(job.departureDate);
  const now = new Date();
  const isDepartureDue = departureDate <= now;
  const crewFilled = job.crewAssigned.length === job.sailorsRequired;

  if (!crewFilled && !isDepartureDue) continue;

      const shipName = `Ship-${Date.now()}`; 

      const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}`
    );
    const weather = weatherResponse.data.weather[0].description;
    const region = weatherResponse.data.name
     
const rawSourceCoords = portLocation[job.sourcePort];
const rawDestinationCoords = portLocation[job.destinationPort];

if (!rawSourceCoords || !rawDestinationCoords) {
  console.error("Invalid source or destination port coordinates", {
    rawSourceCoords,
    rawDestinationCoords
  });
  continue;
}

const sourceCoords = {
  lat: parseFloat(rawSourceCoords.latitude),
  lng: parseFloat(rawSourceCoords.longitude),
};

const destinationCoords = {
  lat: parseFloat(rawDestinationCoords.latitude),
  lng: parseFloat(rawDestinationCoords.longitude),
};


      const distance = haversineDistance(sourceCoords, destinationCoords); 
      const estimatedSpeed = 20; // knots (20 knots = ~37 km/h)

const eta = calculateETA(distance, estimatedSpeed);

if (!eta || isNaN(eta.getTime())) {
  console.error("Skipping ship creation due to invalid ETA:", { eta, distance, estimatedSpeed });
  continue;
}
      const newShip = new Ship({
        name: shipName,
        number: `SHIP-${Date.now()}`,
        source: job.sourcePort, 
        destination: job.destinationPort,
        eta,
        cargoType: job.cargoType, 
        weatherStatus:weather,
        createdBy: portId,
        crew:job.crewAssigned.map(id => ({ sailorId: id })),
        jobReference: job._id,
        departureDate: job.departureDate,
        arrivalDate: eta,
        progress: 0, 
        status: "active",
        currentspeed: estimatedSpeed,
        currentLocation: {
          lat: sourceCoords.lat,
          lng: sourceCoords.lng,
          region: job.sourcePort,
        }
      });

      await newShip.save();

      // Remove job post or mark as converted
      await JobPost.deleteOne({ _id: job._id });


    


      console.log("Job converted to ship:", newShip.name);
    }
    next();

   
  } catch (error) {
    console.error("Error in ConvertToShip middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




export const deleteJobPost = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const job = await JobPost.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job post not found" });
    }

    const portAuthority = await PortAuthority.findOne({ user: userId });
    if (!portAuthority) {
      return res.status(404).json({ message: "Port Authority not found" });
    }

    if (String(job.createdBy) !== String(portAuthority._id)) {
      return res.status(403).json({ message: "Unauthorized - You didn't create this job" });
    }

    await JobPost.findByIdAndDelete(jobId);

    await PortAuthority.findByIdAndUpdate(portAuthority._id, {
      $inc: { activeJobPosts: -1 }
    });

    res.status(200).json({ message: "Job post deleted successfully" });

  } catch (error) {
    console.error("Error deleting job post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateJobPost = async (req, res) => {
  try {
    const jobId = req.params.id;
    const updatedData = req.body;

    const updatedJob = await JobPost.findByIdAndUpdate(jobId, updatedData, {
      new: true,
      runValidators: true
    });

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error("❌ Error updating job:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};





export const viewJobPost = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await JobPost.findById(jobId)
      .populate('createdBy') // optional
      .populate('crewAssigned')   // optional

    if (!job) return res.status(404).json({ message: 'Job not found' });
    const data = {
      sourcePort: job.sourcePort,
      destinationPort: job.destinationPort,
      sailorsRequired: job.sailorsRequired,
      salaryOffered: job.salaryOffered,
      departureDate: job.departureDate,
      cargoType: job.cargoType,
      status: job.status,
      crewAssigned: job.crewAssigned,
      applicationsCount: job.applicationsCount,
      createdDate: job.createdDate
    }
    res.json(job);
  } catch (error) {
    console.error("Error fetching job post:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
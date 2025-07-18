import express from 'express';
import JobPost from '../models/JobPost.model.js';
import Ship from '../models/Ship.model.js';
export const getMyJobPosts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const portAuthority = await PortAuthority.findOne({ user: userId });

        if (!portAuthority) {
          return res.status(404).json({ error: "PortAuthority not found" });
        }
    
        const portId = portAuthority._id;
    const jobPosts = await JobPost.find({ createdBy: portId }).sort({ createdDate: -1 });
    res.status(200).json(jobPosts);
    next();
  } catch (err) {
    console.error("Failed to fetch job posts:", err);
    res.status(500).json({ message: "Server error" });
  }
  
}

import PortAuthority from "../models/PortAuthority.model.js";
import { getWeatherStatus, calculateDistance, calculateETA } from "../utils/shipUtils.js";


export const ConvertToShip = async (req, res) => {
  try {
    const portAuthorityId = req.user.id;
    console.log("Converting job posts to ships for Port Authority ID:", portAuthorityId);

    const jobPosts = await JobPost.find({ createdBy: portAuthorityId, status: 'active' });

    for (const job of jobPosts) {
      const departureToday = new Date(job.departureDate).toDateString() === new Date().toDateString();
      const crewFilled = job.crew.length === job.sailorsRequired;

      if (!crewFilled && !departureToday) continue;

      // Prompt: Ship Name Input (should come from front-end)
      const shipName = `Ship-${Date.now()}`; // Placeholder, frontend should provide dynamic name

      // Fetch weather info (mocked function or external API)
      const weatherStatus = await getWeatherStatus(job.destinationPort); // Use OpenWeatherMap or similar

      // Assume source & destination have fixed coordinates for now (can be fetched from Port model)
      const sourceCoords = { lat: 22.3072, lng: 73.1812 }; // example: Surat
      const destinationCoords = { lat: 41.3851, lng: 2.1734 }; // example: Barcelona

      const distance = calculateDistance(sourceCoords, destinationCoords); // in nautical miles
      const estimatedSpeed = 20; // knots (20 knots = ~37 km/h)
      const eta = calculateETA(distance, estimatedSpeed); // in Date format

      const newShip = new Ship({
        name: shipName,
        number: `SHIP-${Date.now()}`,
        source: job.sourcePort,
        destination: job.destinationPort,
        eta,
        cargoType: job.cargoType,
        weatherStatus,
        createdBy: portAuthorityId,
        crew: job.crew,
        jobReference: job._id,
        departureDate: job.departureDate,
        arrivalDate: null,
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

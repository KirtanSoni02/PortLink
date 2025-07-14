import User from '../models/User.model.js';
import JobPost from "../models/JobPost.model.js";
import PortAuthority from "../models/PortAuthority.model.js";

export const createJobPost = async (req, res) => {
  try {
    const portId = req.user.id; // assuming JWT middleware attaches user info to req.user
    const {
      sourcePort,
      destinationPort,
      sailorsRequired,
      salaryOffered,
      departureDate,
      cargoType
    } = req.body;

    // Create job post
    const newJob = new JobPost({
      createdBy: portId,
      sourcePort,
      destinationPort,
      sailorsRequired,
      salaryOffered,
      departureDate,
      cargoType
    });

    await newJob.save();

    // Increment job post count in PortAuthority
    const updateResult = await PortAuthority.findOneAndUpdate(
  { user: portId }, // ✅ match by user field
  { $inc: { activeJobPosts: 1 } },
  { new: true }
);


console.log("Updated PortAuthority:", updateResult); // ✅ Add this log


   return res.status(201).json(newJob); // ✅ Send the job object directly
   } catch (error) {
    console.error("Error creating job post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getMyJobPosts = async (req, res) => {
  try {
    const portId = req.user.id;

    const jobPosts = await JobPost.find({ createdBy: portId }).sort({ createdDate: -1 });

    res.status(200).json({ jobPosts });
  } catch (error) {
    console.error("Error fetching job posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteJobPost = async (req, res) => {
  try {
    const jobId = req.params.id;
    const portId = req.user.id;

    const job = await JobPost.findOne({ _id: jobId, createdBy: portId });
    if (!job) return res.status(404).json({ message: "Job not found" });

    await JobPost.deleteOne({ _id: jobId });

    // Decrement job count
    await PortAuthority.findByIdAndUpdate(portId, {
      $inc: { activeJobPosts: -1 }
    });

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



import CompletedContract from "../models/CompletedContract.model.js";
import Ship from "../models/Ship.model.js";

export const getPortOverview = async (req, res) => {
  try {
    const portId = req.user.id;

    const port = await PortAuthority.findById(portId).lean();
    const jobs = await JobPost.find({ createdBy: portId }).lean();
    const ships = await Ship.find({}).lean();
    const contracts = await CompletedContract.find({ portAuthority: portId }).lean();

    res.status(200).json({
      portInfo: {
        ...port,
        activeJobPosts: jobs.length,
        totalShipsInTransit: ships.length,
        totalContractsCompleted: contracts.length
      },
      jobPosts: jobs,
      activeShips: ships,
      completedContracts: contracts
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//This is to fetch the 
// port authority profile data for the dashboard


export const getPortDashboardProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');
    const portData = await PortAuthority.findOne({ user: userId });

    if (!user || !portData) {
      return res.status(404).json({ message: 'User or port authority not found' });
    }

    res.status(200).json({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      portName: portData.portName,
      location: portData.location,
      totalShipsInTransit: portData.totalShipsInTransit,
      totalContractsCompleted: portData.totalContractsCompleted,
      activeJobPosts: portData.activeJobPosts,
      registeredSailors: portData.registeredSailors
    });

  } catch (err) {
    console.error('Error fetching port dashboard data:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};





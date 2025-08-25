import User from "../models/User.model.js"
import Ship from "../models/Ship.model.js";
import CompletedContract from "../models/CompletedContract.model.js";
import SailorModel from "../models/Sailor.model.js";
import JobPost from "../models/JobPost.model.js";
import mongoose from "mongoose";
import JobPostModel from "../models/JobPost.model.js";
import portAuthority from "../models/PortAuthority.model.js";

export const getSailorDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    const sailor = await SailorModel.findOne({ user: userId });
    console.log("Sailor data:", sailor); // ✅ Fixed typo

    if (!user || user.role !== "sailor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const completedContracts = await CompletedContract.find({
      "crew.sailorId": sailor._id,
    });

    const sailorObjectId = new mongoose.Types.ObjectId(sailor._id);

const activeShip = await Ship.findOne({
  "crew.sailorId": sailorObjectId,
  status: "active",
});

if(!activeShip) {
  return res.json({ 
      id: sailor._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      experience: user.experience,
      rating: sailor.rating || 0,
      completedContracts: completedContracts.length,
      location:user.location,
      hasOngoingContract: !!activeShip,
    });
}

  const portauthorityid = await portAuthority.findById(activeShip.createdBy);
  const portAuthoritydetails = await User.findById(portauthorityid.user);

    let currentContract = null;
    if (activeShip) {
      currentContract = {
        id: activeShip._id,
        sourcePort: activeShip.source,
        destinationPort: activeShip.destination,
        shipName: activeShip.name,
        shipNumber: activeShip.number,
        estimatedArrival: activeShip.eta.toISOString(),
        currentLocation: {
          lat: activeShip.currentLocation?.lat || 0,
          lng: activeShip.currentLocation?.lng || 0,
          region: activeShip.currentLocation?.region || "Unknown",
        },
        progress: activeShip.progress,
        salary: activeShip.salary || 0,
        startDate: activeShip.departureDate.toISOString(),
      };
    }

    const dashboardData = {
      id: sailor._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      experience: user.experience,
      rating: sailor.rating || 0,
      completedContracts: completedContracts.length,
      location:user.location,
      hasOngoingContract: !!activeShip,
      currentContract,
      currentShip: activeShip && {
        id: activeShip._id,
        name: activeShip.name,
        number: activeShip.number,
        cargoType: activeShip.cargoType,
        capacity: activeShip.capacity || 'N/A',
        weather:activeShip.weatherStatus,
        departureTime: activeShip.departureDate.toISOString(),
        arrivalTime: activeShip.arrivalDate?.toISOString() || activeShip.eta.toISOString(),
        createdBy: portAuthoritydetails.firstName+" "+portAuthoritydetails.lastName,
        ContactdetailsOfPortAuthority: portAuthoritydetails.phone,
      },
    };

    res.json(dashboardData);
  } catch (err) {
    console.error("Sailor dashboard fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateSailorProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email, phone, location } = req.body;
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ')[1];
  try {
    const updatedSailor = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email, phone, location },
      { new: true }
    );

    if (!updatedSailor) {
      return res.status(404).json({ success: false, message: 'Sailor not found' });
    }

    res.status(200).json({ success: true, data: updatedSailor });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};




export const getAvailableShipments = async (req, res) => {
  try {
    const sailor = await SailorModel.findOne({ user: req.user.id });
const hasAlreadyApplied = await JobPost.exists({ crewAssigned: sailor._id });


    const availableShipments = await JobPost.find({ status: "active" });
    res.json({ shipments: availableShipments, hasAlreadyApplied });
  } catch (error) {
    console.error("Error fetching available shipments:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getContractHistory = async (req, res) => {
  try {
    const { sailorId } = req.params;
console.log("Sailor ID:", sailorId); // Debugging line
    // Find contracts where this sailor was part of the crew
    const contracts = await CompletedContract.find({ 'crew.sailorId': sailorId })
      .populate('portAuthority', 'name')
      .lean();
console.log("Contracts found:", contracts); // Debugging line
    // Format response
    const result = contracts.map(c => ({
      id: c._id,
      company: c.portAuthority?.name || 'Unknown',
      shipName: c.shipName,
      shipNumber: c.shipNumber,
      sourcePort: c.route?.source,
      destinationPort: c.route?.destination,
      startDate: c.startDate,
      endDate: c.endDate,
      duration: c.duration,
      salary: c.totalPayment,
      status: 'completed',
      completedAt: c.completedAt,
      cargoType: c.cargoType,
      sailorsCount: c.sailorsCount,
      crew: c.crew.map(member => ({
        sailorId: member.sailorId,
        name: member.name,
        role: member.role,
        experience: member.experience
      }))
    }));

    res.json(result);
  } catch (err) {
    console.error('GET /completed-contracts error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

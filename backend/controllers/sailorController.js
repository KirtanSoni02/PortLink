import User from "../models/User.model.js"
import Ship from "../models/Ship.model.js";
import CompletedContract from "../models/CompletedContract.model.js";
import SailorModel from "../models/Sailor.model.js";

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

    const activeShip = await Ship.findOne({
      "crew.sailorId": sailor._id,
      status: "active",
    });

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
          name: activeShip.currentLocation?.region || "Unknown",
        },
        progress: activeShip.progress,
        salary: activeShip.salary || 0,
        startDate: activeShip.departureDate.toISOString(),
      };
    }

    const dashboardData = {
      id: user._id,
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
        departureTime: activeShip.departureDate.toISOString(),
        arrivalTime: activeShip.arrivalDate?.toISOString() || activeShip.eta.toISOString(),
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
import ShipmentApplication from "../models/ShipmentApplication.model.js";

export const submitApplication = async (req, res) => {
  try {
    const {
      shipmentId,
      sailorEmail,
      sailorName,
      sailorPhone,
      sailorExperience,
      sailorRating,
      personalMessage,
      availabilityDate,
      relevantExperience,
      certifications,
      emergencyContact,
      emergencyPhone,
      medicalCertification,
      passportNumber,
      visaStatus
    } = req.body;

    // Validation
    if (
      !shipmentId ||
      !sailorEmail ||
      !sailorName ||
      !sailorPhone ||
      !sailorExperience ||
      !sailorRating ||
      !personalMessage ||
      !availabilityDate ||
      !relevantExperience ||
      !certifications ||
      !emergencyContact ||
      !emergencyPhone ||
      !medicalCertification ||
      !passportNumber ||
      !visaStatus
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }
    if (personalMessage.length < 50) {
      return res.status(400).json({ error: "Personal message must be at least 50 characters." });
    }

    // Save to DB
    const application = new ShipmentApplication({
      shipmentId,
      sailorEmail,
      sailorName,
      sailorPhone,
      sailorExperience,
      sailorRating,
      personalMessage,
      availabilityDate,
      relevantExperience,
      certifications,
      emergencyContact,
      emergencyPhone,
      medicalCertification,
      passportNumber,
      visaStatus
    });

    await application.save();
    res.status(201).json({ success: true, application });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};

export const getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applications = await ShipmentApplication.find({ shipmentId: jobId }).sort({
      applicationDate: -1,
    });
    res.status(200).json(applications);
  } catch (err) {
    console.error("Error fetching shipment applications:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const acceptApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await ShipmentApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    const job = await (await import("../models/JobPost.model.js")).default.findById(application.shipmentId);
    if (!job) {
      return res.status(404).json({ error: "Job posting not found" });
    }

    const User = (await import("../models/User.model.js")).default;
    const Sailor = (await import("../models/Sailor.model.js")).default;

    // Find sailor by email
    const user = await User.findOne({ email: application.sailorEmail });
    if (!user) {
      return res.status(404).json({ error: "Sailor user not found" });
    }

    let sailor = await Sailor.findOne({ user: user._id });
    if (!sailor) {
      sailor = new Sailor({ user: user._id, rating: application.sailorRating || 4.5 });
      await sailor.save();
    }

    // Check if already in crew
    const alreadyInCrew = job.crewAssigned.some(
      (id) => id.toString() === sailor._id.toString()
    );

    if (!alreadyInCrew) {
      if (job.crewAssigned.length >= job.sailorsRequired) {
        return res.status(400).json({ error: "Crew is already full for this voyage." });
      }
      job.crewAssigned.push(sailor._id);
      if (job.crewAssigned.length >= job.sailorsRequired) {
        job.status = "filled";
      }
      await job.save();
    }

    application.status = "accepted";
    await application.save();

    res.status(200).json({
      message: "Application accepted and sailor assigned to crew",
      application,
      job,
    });
  } catch (err) {
    console.error("Error accepting application:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await ShipmentApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    application.status = "rejected";
    await application.save();

    res.status(200).json({
      message: "Application rejected",
      application,
    });
  } catch (err) {
    console.error("Error rejecting application:", err);
    res.status(500).json({ error: "Server error" });
  }
};
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
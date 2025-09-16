import mongoose from "mongoose";

const ShipmentApplicationSchema = new mongoose.Schema({
  shipmentId: { type: String, required: true },
  sailorEmail: { type: String, required: true, index: true },
  sailorName: { type: String, required: true },
  sailorPhone: { type: String, required: true },
  sailorExperience: { type: String, required: true },
  sailorRating: { type: Number, required: true },
  applicationDate: { type: Date, default: Date.now },

  personalMessage: { type: String, required: true, minlength: 50 },
  availabilityDate: { type: Date, required: true },
  relevantExperience: { type: String, required: true },
  certifications: { type: String, required: true },
  emergencyContact: { type: String, required: true },
  emergencyPhone: { type: String, required: true },
  medicalCertification: { type: String, required: true },
  passportNumber: { type: String, required: true },
  visaStatus: { type: String, required: true },

  status: { type: String, default: "pending" }
});

export default mongoose.model("ShipmentApplication", ShipmentApplicationSchema);
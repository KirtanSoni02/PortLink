import mongoose from "mongoose";

const jobPostSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PortAuthority",
    required: true
  },
  sourcePort: { type: String, required: true },
  destinationPort: { type: String, required: true },
  sailorsRequired: { type: Number, required: true },
  salaryOffered: { type: Number, required: true },
  departureDate: { type: Date, required: true },
  cargoType: { type: String, required: true },
  status: {
    type: String,
    enum: ['active', 'filled', 'expired'],
    default: 'active'
  },
  crewAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sailor' }],
  applicationsCount: { type: Number, default: 0 },
  createdDate: { type: Date, default: Date.now }
});

export default mongoose.model("JobPost", jobPostSchema);

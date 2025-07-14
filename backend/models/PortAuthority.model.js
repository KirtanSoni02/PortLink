import mongoose from "mongoose";

const portAuthoritySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Linked to your main auth model
    required: true,
    unique: true
  },
  portName: { type: String, required: true },
  location: {
    city: String,
    state: String,
    country: String
  },
  totalShipsInTransit: { type: Number, default: 0 },
  totalIncomingShips: { type: Number, default: 0 },
  totalContractsCompleted: { type: Number, default: 0 },
  activeJobPosts: { type: Number, default: 0 },
  registeredSailors: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("PortAuthority", portAuthoritySchema);

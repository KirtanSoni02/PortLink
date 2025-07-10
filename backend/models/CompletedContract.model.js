import mongoose from "mongoose";

const completedContractSchema = new mongoose.Schema({
  portAuthority: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PortAuthority",
    required: true
  },
  ship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ship",
    required: true
  },
  shipNumber: String,
  shipName: String,

  startDate: Date,
  endDate: Date,

  sailorsCount: Number,
  crew: [{
    sailorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    role: String,
    experience: String
  }],

  route: {
    source: String,
    destination: String
  },

  cargoType: String,
  totalPayment: Number,
  duration: String,

  completedAt: {
    type: Date,
    default: Date.now
  }
});
export default mongoose.model("CompletedContract", completedContractSchema);


//In this model we kept this many things indtead of ship model because we neeed to delete ship model after completion of contract and we need to keep this data for future reference
//So we are keeping this data in completed contract model
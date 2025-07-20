import mongoose from 'mongoose';

const shipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true, unique: true ,default: () => `SHIP-${Date.now()}`,},
  source: { type: String, required: true },
  destination: { type: String, required: true },
  eta: { type: Date, required: true }, // Can be Date or duration //Estimated arrival time

  cargoType: { type: String, required: true },
  weatherStatus: {type:String},

  //  Real-time location
  currentLocation: {
    lat: Number,
    lng: Number,
    region: String,
  },

  // Link to the port authority who created this shipment
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PortAuthority',
    required: true,
  },

  // List of assigned sailors (array of ObjectId)
  crew: [{
    sailorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sailor',
      required: true,
    }
  }],

  jobReference: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "JobPost",
  required: true
},


  departureDate: { type: Date, required: true },
  arrivalDate: { type: Date } ,// Can be null until completed

  progress: { type: Number, default: 0 }, // percent completion

  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
  currentspeed: { type: Number, default: 0 }, // in knots
}, { timestamps: true });

export default mongoose.model('Ship', shipSchema);

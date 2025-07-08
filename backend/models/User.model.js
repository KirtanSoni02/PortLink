import exp from "constants";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['sailor', 'port', 'service'], required: true },
  location: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  experience: { type: String, enum: ['yes', 'no'] }
}, { timestamps: true });
  
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

export default mongoose.model('User', userSchema);
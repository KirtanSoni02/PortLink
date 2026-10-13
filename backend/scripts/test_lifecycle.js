import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.model.js";
import Sailor from "../models/Sailor.model.js";
import PortAuthority from "../models/PortAuthority.model.js";
import JobPost from "../models/JobPost.model.js";
import Ship from "../models/Ship.model.js";
import CompletedContract from "../models/CompletedContract.model.js";
import { archiveCompletedShips } from "../controllers/shipController.js";

const runLifecycleTest = async () => {
  console.log("🚀 Starting End-to-End Lifecycle & Payroll Test...");
  await connectDB();

  try {
    // 1. Create or Find Mock Port Authority User
    let portUser = await User.findOne({ email: "test.port@portlink.com" });
    if (!portUser) {
      portUser = await User.create({
        firstName: "Port",
        lastName: "Master",
        email: "test.port@portlink.com",
        password: "Password123",
        role: "port",
        isEmailVerified: true
      });
    }

    let portAuth = await PortAuthority.findOne({ user: portUser._id });
    if (!portAuth) {
      portAuth = await PortAuthority.create({
        user: portUser._id,
        portName: "Port of Mumbai",
        location: { city: "Mumbai", state: "Maharashtra", country: "India" }
      });
    }

    // 2. Create or Find Mock Sailor User
    let sailorUser = await User.findOne({ email: "test.sailor@portlink.com" });
    if (!sailorUser) {
      sailorUser = await User.create({
        firstName: "Alexander",
        lastName: "Vessel",
        email: "test.sailor@portlink.com",
        password: "Password123",
        role: "sailor",
        isEmailVerified: true
      });
    }

    let sailorObj = await Sailor.findOne({ user: sailorUser._id });
    if (!sailorObj) {
      sailorObj = await Sailor.create({
        user: sailorUser._id,
        rating: 4.9
      });
    }

    console.log(`✅ Mock User Accounts Ready: Port [${portAuth.portName}] & Sailor [${sailorUser.firstName} ${sailorUser.lastName}]`);

    // 3. Create Job Post
    const job = await JobPost.create({
      createdBy: portAuth._id,
      sourcePort: "Port of Mumbai",
      destinationPort: "Port of Cochin (Kochi)",
      sailorsRequired: 1,
      salaryOffered: 15000,
      departureDate: new Date(),
      cargoType: "Container Cargo",
      crewAssigned: [sailorObj._id],
      status: "active"
    });

    console.log(`✅ Job Post Created: ${job.sourcePort} → ${job.destinationPort} ($${job.salaryOffered})`);

    // 4. Convert Job Post to Ship (Simulate Conversion)
    const testShip = await Ship.create({
      name: `M/V Ship-${job.sourcePort}-${job.destinationPort}`,
      number: `SHIP-TEST-${Date.now()}`,
      source: job.sourcePort,
      destination: job.destinationPort,
      contractvalue: job.salaryOffered,
      eta: new Date(Date.now() + 86400000),
      cargoType: job.cargoType,
      weatherStatus: "Clear Skies",
      createdBy: portAuth._id,
      crew: [{ sailorId: sailorObj._id }],
      jobReference: job._id,
      departureDate: job.departureDate,
      progress: 100, // Destination Reached
      status: "active",
      currentspeed: 18,
      currentLocation: {
        lat: 9.9667,
        lng: 76.2833,
        region: "Port of Cochin (Kochi)"
      }
    });

    console.log(`✅ Ship Converted & Reached Destination (Progress 100%): ${testShip.name}`);

    // 5. Trigger Archival & Payroll Processing
    console.log("⏳ Executing Archive & Payroll Processing...");
    await archiveCompletedShips();

    // 6. Verify Completed Contract Record
    const completedContract = await CompletedContract.findOne({ shipNumber: testShip.number });
    if (completedContract) {
      console.log("🎉 SUCCESS: Contract Completed & Batch Payroll Processed!");
      console.log(`   - Ship Name: ${completedContract.shipName}`);
      console.log(`   - Route: ${completedContract.route.source} → ${completedContract.route.destination}`);
      console.log(`   - Total Payment: $${completedContract.totalPayment}`);
      console.log(`   - Crew Members Credited: ${completedContract.crew.length}`);
    } else {
      console.error("❌ FAILED: Completed contract record not found.");
    }

  } catch (err) {
    console.error("❌ Lifecycle test error:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

runLifecycleTest();

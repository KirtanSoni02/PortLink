import mongoose from "mongoose";
import dotenv from "dotenv";
import JobPost from "../models/JobPost.model.js"; // adjust path as needed

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1);
  }
};

const seedJobPosts = async () => {
  await connectDB();

  try {
    // Replace this with an actual PortAuthority _id from your DB
    const portAuthorityId = "686faa5256fb25edbbe026ee";

    const mockJobPosts = [
      {
        createdBy: portAuthorityId,
        sourcePort: "Port of Los Angeles",
        destinationPort: "Port of Tokyo",
        sailorsRequired: 10,
        salaryOffered: 22000,
        departureDate: new Date("2025-07-10"),
        cargoType: "Container Cargo",
        status: "active",
        crewAssigned: [],
        applicationsCount: 5,
        createdDate: new Date("2025-07-01")
      },
      {
        createdBy: portAuthorityId,
        sourcePort: "Port of Rotterdam",
        destinationPort: "Port of Mumbai",
        sailorsRequired: 8,
        salaryOffered: 18000,
        departureDate: new Date("2025-07-15"),
        cargoType: "General Cargo",
        status: "filled",
        crewAssigned: [
          "64a1cc3e2edcf9ab98765432",
          "64a1cc3e2edcf9ab98765433"
        ],
        applicationsCount: 12,
        createdDate: new Date("2025-06-28")
      },
      {
        createdBy: portAuthorityId,
        sourcePort: "Port of Singapore",
        destinationPort: "Port of Hamburg",
        sailorsRequired: 6,
        salaryOffered: 20000,
        departureDate: new Date("2025-07-20"),
        cargoType: "Bulk Cargo",
        status: "expired",
        crewAssigned: [],
        applicationsCount: 3,
        createdDate: new Date("2025-06-25")
      }
    ];

    // await JobPost.deleteMany(); // optional: clears old data
    await JobPost.insertMany(mockJobPosts);

    console.log("🌱 JobPost seeding completed.");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedJobPosts();

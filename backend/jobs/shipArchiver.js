import cron from "node-cron";
import { archiveCompletedShips } from "../controllers/shipController.js";

const startShipArchiver = () => {
  // Run every minute
  cron.schedule("* * * * *", async () => {
    console.log("⏳ Running ship archiver job...");
    await archiveCompletedShips();
  });
};

export default startShipArchiver;

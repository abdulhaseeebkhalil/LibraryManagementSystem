import cron from "node-cron";
import User from "../models/userModel.js";

export const removeUnverifiedAccounts = () => {
  cron.schedule("0 * * * *", async () => {
    console.log("Checking unverified users...");

    const timeLimit = new Date(Date.now() - 24 * 60 * 60 * 1000);

    await User.deleteMany({
      accountVerified: false,
      createdAt: { $lt: timeLimit },
    });

    console.log("Unverified users removed");
  });
};
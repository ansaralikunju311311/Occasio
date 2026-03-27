import { connectDateBase } from "../config/database.js"
export const initializaApp = async():Promise<void>=>{
 await connectDateBase();
}
import cron from "node-cron";

import { UserModel } from "../../modules/auth/infrastructure/database/user.model.js";

export const clearExpiredOtpJob = () => {
  cron.schedule("*/10 * * * *", async () => {
    try {
      const now = new Date();

      const result = await UserModel.updateMany(
        {
          otpExpires: { $ne: null, $lt: now }
        },
        {
          $set: {
            otp: null,
            otpExpires: null,
            otpType: null,
            otpSendAt: null
          }
        }
      );

      console.log(` OTP cleanup: ${result.modifiedCount} users updated`);

    } catch (error) {
      console.error("Cron job error:", error);
    }
  });
};
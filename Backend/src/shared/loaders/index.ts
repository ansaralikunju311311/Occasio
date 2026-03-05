import { connectDateBase } from "../config/database.js"
export const initializaApp = async():Promise<void>=>{
 await connectDateBase();
}
import cron from "node-cron";
import { UserModel } from "../../modules/auth/infrastructure/database/user.model.js";

export const clearExpiredOtpJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      await UserModel.updateMany(
        { otpExpires: { $lt: now } },
        {
          $set: {
            otp: null,
           
             
       otpExpires:null,
       otpType:null,
      otpSentAt:null
          }
        }
      );

      console.log("Expired OTPs cleared");
    } catch (error) {
      console.error("Cron job error:", error);
    }
  });
};
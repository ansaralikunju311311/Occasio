import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserModel } from "../../../modules/auth/infrastructure/database/user.model.js"
import { UserRole } from "../../../../src/common/enums/user-role.enum.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {

        const email = profile.emails?.[0].value;
        const name = profile.displayName;

        let user = await UserModel.findOne({ email });

        if (!user) {
          user = await UserModel.create({
            name,
            email,
            password: "GOOGLE_AUTH",
            role: UserRole.USER,
            isVerified: true
          });
        }

        return done(null, user);

      } catch (error) {
        return done(error);
      }
    }
  )
);
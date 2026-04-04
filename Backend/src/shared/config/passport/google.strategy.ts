import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserModel } from "../../../infrastructure/database/model/user.model"
import { UserRole } from "../../../common/enums/userrole-enum";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        const name = profile.displayName;

        // Extract role from state
        let role = UserRole.USER;
        if (req.query.state) {
          try {
            const state = JSON.parse(req.query.state as string);
            if (state.role) {
              role = state.role;
            }
          } catch (e) {
            console.error("Error parsing profile state:", e);
          }
        }

        let user = await UserModel.findOne({ email });

        if (!user) {
          user = await UserModel.create({
            name,
            email,
            password: "GOOGLE_AUTH", // dummy password
            role: role,
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
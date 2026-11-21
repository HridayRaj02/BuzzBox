// Passport Google OAuth setup. It only activates when all Google credentials are configured.
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./prisma";
import { createHandle } from "./auth";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL;

export const googleAuthConfigured = Boolean(googleClientId && googleClientSecret && googleCallbackUrl);

if (googleAuthConfigured) {
  passport.use(new GoogleStrategy({ clientID: googleClientId!, clientSecret: googleClientSecret!, callbackURL: googleCallbackUrl! }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value?.trim().toLowerCase();
      if (!email) return done(new Error("Google did not provide an email address."));
      const city = await prisma.city.findFirst({ where: { isActive: true }, orderBy: { name: "asc" } });
      // An existing password account with the same verified Google email is linked safely.
      const existing = await prisma.user.findFirst({ where: { OR: [{ googleId: profile.id }, { email }] } });
      const user = existing
        ? await prisma.user.update({ where: { id: existing.id }, data: { googleId: profile.id, name: profile.displayName || existing.name, photoUrl: profile.photos?.[0]?.value || existing.photoUrl }, include: { city: { select: { id: true, name: true, slug: true } } } })
        : await prisma.user.create({ data: { googleId: profile.id, name: profile.displayName || email, email, photoUrl: profile.photos?.[0]?.value, handle: createHandle(profile.displayName || email), cityId: city?.id }, include: { city: { select: { id: true, name: true, slug: true } } } });
      done(null, user);
    } catch (error) { done(error as Error); }
  }));
}

export { passport };

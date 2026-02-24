import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load .env from backend root (2 levels up from config/)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db } from 'db';

// Validate required env vars
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
  console.warn('⚠️  Google OAuth credentials not configured. Google sign-in will be disabled.');
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || '';
        
        // Check if user exists with this Google ID or email
        let user = await db.user.findFirst({
          where: {
            OR: [
              { providerId: profile.id },
              ...(email ? [{ email }] : [])
            ]
          }
        });

        if (user) {
          // Update existing user with Google info if needed
          if (!user.providerId) {
            user = await db.user.update({
              where: { id: user.id },
              data: {
                provider: 'google',
                providerId: profile.id,
                avatarUrl: profile.photos?.[0]?.value ?? null,
              }
            });
          }
        } else {
          // Create new user
          user = await db.user.create({
            data: {
              name: profile.displayName,
              email,
              provider: 'google',
              providerId: profile.id,
              avatarUrl: profile.photos?.[0]?.value ?? null,
            }
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
    )
  );
}

export default passport;
import  express  from "express";
import { signInSchema, signUpSchema } from "../types.js";
import { db } from "db";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { authenticate } from "../middleware.js";
import passport from "passport";

const router: express.Router = express.Router();

router.post('/signin', async (req, res) => {
    const validateData = signInSchema.safeParse(req.body);
    if (!validateData.success) {
        return res.status(400).json({ error: validateData.error.message });
    }

    const { email, password } = req.body;

    try {
        const checkUser = await db.user.findFirst({
            where: {
                email: email,
            }
        })

        if (!checkUser) return res.status(400).json({ error: 'No user found exists with this email' });

        const isPasswordValid = await bcryptjs.compare(password, checkUser.password as string);

        if (!isPasswordValid) return res.status(400).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ id: checkUser.id, email: email, name: checkUser.name }, process.env.JWT_SECRET as string, { expiresIn: '6h' });

        return res.status(200).json({ success: true, token: token });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to sign in', message: error });
    }
})

router.post('/signup', async (req, res) => {
    const validateData = signUpSchema.safeParse(req.body);
    if (!validateData.success) {
        return res.status(400).json({ error: validateData.error.message });
    }
    const { username, email, password } = req.body;
    try {
        const checkUser = await db.user.findFirst({
            where: {
                email: email
            }
        })
        console.log(checkUser);
        if (checkUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const user = await db.user.create({
            data: {
                name: username,
                email: email,
                password: hashedPassword,
            }
        })
        console.log(user);

        return res.status(201).json({ success: true, user: { id: user.id, email: user.email } });
    } catch (error: any) {
        console.error('Signup error:', error);
        // Check if it's a Prisma initialization error
        if (error?.name === 'PrismaClientInitializationError') {
            return res.status(500).json({ 
                error: 'Database connection failed', 
                message: error.message || 'Please check your DATABASE_URL environment variable',
                details: process.env.DATABASE_URL ? 'DATABASE_URL is set' : 'DATABASE_URL is not set'
            });
        }
        return res.status(500).json({ error: 'Failed to create user', message: error?.message || String(error) });
    }
})

router.get('/me', authenticate, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    try {
        const user = await db.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true,
                name: true,
            }
        })

        return res.status(200).json({ success: true, user: { id: user?.id, email: user?.email, name: user?.name } });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get user', message: error });
    }
})

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/auth/google/callback',
    passport.authenticate('google', { 
      session: false,
      failureRedirect: '/signin?error=google_auth_failed' 
    }),
    (req, res) => {
      // Generate JWT token
      const user = req.user as any;
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.JWT_SECRET!,
        { expiresIn: '6h' }
      );
  
      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    }
  );

export { router as authRoutes };


import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
// Import passport from config to ensure Google strategy is registered
import passport from "./config/passport.js";
import { authRoutes } from "./routes/authRoutes.js";
import { roomRoutes } from "./routes/roomRoutes.js";
import { chatRoutes } from "./routes/chatRoutes.js";

const app = express();
app.use(express.json());

// Normalize frontend URL (remove trailing slash) and support multiple origins
const normalizeOrigin = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    return url.replace(/\/+$/, ''); // Remove trailing slashes
};

const allowedOrigins = [
    normalizeOrigin(process.env.FRONTEND_URL),
    'http://localhost:3000',
    'http://localhost:3001',
    'https://notes-io-frontend.vercel.app',
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            return callback(null, true);
        }
        
        // Normalize the origin (remove trailing slash)
        const normalizedOrigin = normalizeOrigin(origin);
        
        if (normalizedOrigin && allowedOrigins.includes(normalizedOrigin)) {
            callback(null, normalizedOrigin);
        } else {
            // In development, allow all origins
            if (process.env.NODE_ENV === 'development') {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(passport.initialize());

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/v1', authRoutes);

app.use('/api/v1', roomRoutes);

app.use('/api/v1', chatRoutes);

// Global error handler - must be after all routes
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ 
        error: errorMessage || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
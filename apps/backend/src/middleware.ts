import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "db";

export async function authenticate(req: Request, res: Response, next: NextFunction){
    const token = req.headers.authorization;
    if (!token) {
        console.error('No authorization header found. Headers:', Object.keys(req.headers));
        return res.status(401).json({ error: 'User is unauthorized, redirect to login page' });
    }
    
    try {
        // JWT verify can throw an error if token is invalid
        const decode = jwt.verify(token, process.env.JWT_SECRET as string);
        
        if (!decode){
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        console.log("decode", decode);
        
        //@ts-ignore
        const userId = decode.id as string;
        
        if (!userId) {
            console.error('No user ID in token');
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        const user = await db.user.findUnique({
            where: {
                id: userId,
            }
        })
        
        if (!user){
            console.error('User not found in database:', userId);
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        //@ts-ignore
        req.userId = user.id;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        // Handle JWT specific errors
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(401).json({ error: 'Unauthorized' });
    }
}
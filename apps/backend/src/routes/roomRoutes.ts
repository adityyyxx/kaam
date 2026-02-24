import express from "express";
import { authenticate } from "../middleware.js";
import { db } from "db";
const router: express.Router = express.Router();

// Gets the first chat room for the user
router.get('/getRooms', authenticate, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    
    if (!userId) {
        console.error('No userId found in request');
        return res.status(401).json({ error: 'User ID not found' });
    }
    
    try {
        console.log('Getting rooms for userId:', userId);
        const chatRooms = await db.chatRoom.findFirst({
            where: {
                userId: userId
            },
            orderBy: {
                updatedAt: 'desc'
            }
        })

        if (chatRooms) {
            return res.status(200).json({
                success: true,
                roomId: chatRooms.id,
            })
        } else {
            // User has no chat rooms yet (first-time user)
            // Return success with null roomId so frontend can create one
            return res.status(200).json({
                success: true,
                roomId: null,
            })
        }
    } catch (error) {
        console.error('Error in getRooms:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        console.error('Error details:', { message: errorMessage, stack: errorStack });
        return res.status(500).json({ 
            error: 'Failed to get chat rooms', 
            message: errorMessage 
        });
    }
});

// creates a new chat room for the user
router.post('/createChatRoom', authenticate, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    
    if (!userId) {
        console.error('No userId found in request');
        return res.status(401).json({ error: 'User ID not found' });
    }
    
    try {
        console.log('Creating chat room for userId:', userId);
        const newChatRoom = await db.chatRoom.create({
            data: {
                userId: userId,
            }
        })

        return res.status(201).json({ chatRoomId: newChatRoom.id });
    } catch (error) {
        console.error('Error in createChatRoom:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        console.error('Error details:', { message: errorMessage, stack: errorStack });
        return res.status(500).json({ 
            error: 'Failed to create chat room', 
            message: errorMessage 
        });
    }
})

// Gets all the chatRooms title for the user
router.get('/getAllChatRooms', authenticate, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    try {
        const userchatRoomstitles = await db.chatRoom.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                updatedAt: 'desc'
            },
            take: 20,
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true,
            }
        })

        return res.status(200).json({ success: true, data: userchatRoomstitles });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get chat rooms', message: error });
    }
})

export { router as roomRoutes };
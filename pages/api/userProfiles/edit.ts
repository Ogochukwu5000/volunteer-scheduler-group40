import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../lib/mongodb";
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

interface JwtPayload {
  _id: string;
  email: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PUT") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const userId = decoded.userId;

        // Remove _id from updates if it exists
        const { _id, ...updates } = req.body;
        
        const db = client.db("your-db-name");
        const result = await db.collection("userProfiles").updateOne(
            { userId: userId },
            { 
                $set: {
                    ...updates,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        }
        console.error(error);
        res.status(500).json({ message: String(error) });
    }
}
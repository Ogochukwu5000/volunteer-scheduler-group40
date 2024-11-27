// pages/api/auth/session.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import client from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(200).json(null);

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    const db = client.db("your-db-name");
    const user = await db.collection("users").findOne({ 
      _id: new ObjectId(decoded.userId) 
    });

    if (!user) return res.status(200).json(null);

    return res.status(200).json({
      user: {
        _id: user._id.toString(),
        
      }
    });
  } catch (error) {
    return res.status(200).json(null);
  }
}
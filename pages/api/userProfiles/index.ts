import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';

export interface IUserProfile {
   _id?: ObjectId;
   fullName: string;
   address1: string;
   address2?: string;
   city: string;
   state: string;
   zipCode: string;
   skills: string[];
   preferences?: string;
   availability: string[];
   createdAt: Date;
   updatedAt: Date;
}

interface JwtPayload {
  _id: string;
  email: string;
  role: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== "GET") {
       return res.status(405).json({ message: "Method not allowed" });
   }
 
   try {
       // Get token from Authorization header
       const authHeader = req.headers.authorization;
       if (!authHeader || !authHeader.startsWith('Bearer ')) {
           return res.status(401).json({ message: "No token provided" });
       }

       const token = authHeader.split(' ')[1];
       
       // Verify and decode the token
       const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
       const userId = decoded.userId;

       const db = client.db("your-db-name");
       const profile = await db.collection<IUserProfile>("userProfiles")
           .findOne({ _id: new ObjectId(userId as string) });
       console.log(decoded)
       if (!profile) {
           return res.status(404).json({ message: "Profile not found" });
       }

       res.status(200).json(profile);

   } catch (error) {
       if (error instanceof jwt.JsonWebTokenError) {
           return res.status(401).json({ message: "Invalid token" });
       }
       console.error(error);
       res.status(500).json({ message: String(error) });
   }
}
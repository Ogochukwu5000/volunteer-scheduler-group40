// pages/api/profile/update.ts
import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../lib/mongodb";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string };

    const {
      fullName,
      address1,
      address2,
      city,
      state,
      zipCode,
      skills,
      preferences,
      availability,
    } = req.body;

    // Validate required fields
    if (!fullName || !address1 || !city || !state || !zipCode || !skills || !availability) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate field lengths
    if (fullName.length > 50 || address1.length > 100 || (address2 && address2.length > 100) || city.length > 100) {
      return res.status(400).json({ message: "One or more fields exceed maximum length" });
    }

    // Validate zip code
    if (zipCode.length < 5 || zipCode.length > 9) {
      return res.status(400).json({ message: "Invalid zip code format" });
    }

    const db = client.db("your-db-name");
    
    // Update user profile
    await db.collection("users").updateOne(
      { _id: decoded.userId },
      {
        $set: {
          profile: {
            fullName,
            address1,
            address2,
            city,
            state,
            zipCode,
            skills,
            preferences,
            availability: availability.map((date: string) => new Date(date)),
          },
          updatedAt: new Date(),
        },
      }
    );
    
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Error updating profile" });
  }
}
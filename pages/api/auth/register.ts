// pages/api/auth/register.ts
import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import { IUser } from "@/lib/models/users.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      email,
      password,
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
    if (!email || !password || !fullName || !address1 || !city || !state || !zipCode || !skills || !availability) {
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
    
    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with profile
    const user: IUser = {
      email,
      password: hashedPassword,
      role: "user",
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("users").insertOne(user);
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
}
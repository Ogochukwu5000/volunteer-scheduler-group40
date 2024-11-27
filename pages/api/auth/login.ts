// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "@/lib/models/users.model";
import { IUserProfile } from "@/lib/models/userProfile.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const db = client.db("your-db-name");

    // Find user by email
    const user = await db.collection("users").findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Fetch the user's profile information
    const userProfile = await db.collection("userProfiles").findOne({ _id: user._id });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET!, // Make sure to set this in your .env file
      { expiresIn: "24h" }
    );

    // Return success with token and user information
    res.status(200).json({ 
      message: "Login successful",
      token,
      user: {
        email: user.email,
        role: user.role,
        fullName: userProfile?.fullName || ""
      },
      redirectUrl: "/profile"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
}
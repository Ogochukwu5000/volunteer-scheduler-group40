import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
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
      return res.status(400).json({ message: "Missing required fields" });
    }

    const db = client.db("your-db-name");

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user document
    const newUser: IUser = {
      email,
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userResult = await db.collection("users").insertOne(newUser);

    // Create new user profile document
    const newUserProfile: IUserProfile = {
      _id: userResult.insertedId,
      fullName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      skills: [],
      preferences: "",
      availability: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("userProfiles").insertOne(newUserProfile);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
}
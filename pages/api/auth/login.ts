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
 console.log("Login request received:", req.body);

 if (req.method !== "POST") {
   return res.status(405).json({ message: "Method not allowed" });
 }

 try {
   const { email, password } = req.body;
   console.log("Email:", email);

   if (!email || !password) {
     return res.status(400).json({ message: "Email and password required" });
   }

   const db = client.db("your-db-name");
   console.log("DB connected");

   const user = await db.collection("users").findOne({ email });
   console.log("User lookup result:", user);

   if (!user) {
     console.log("No user found");
     return res.status(401).json({ message: "Invalid credentials" });
   }

   const isPasswordValid = await bcrypt.compare(password, user.password);
   console.log("Password valid:", isPasswordValid);

   if (!isPasswordValid) {
     return res.status(401).json({ message: "Invalid credentials" });
   }

   const userProfile = await db.collection("userProfiles").findOne({ 
     userId: user._id.toString() 
   });
   console.log("User profile:", userProfile);

   const token = jwt.sign(
     {
       userId: user._id,
       email: user.email,
       role: user.role
     },
     process.env.JWT_SECRET!,
     { expiresIn: "24h" }
   );

   res.status(200).json({
     token,
     user: {
       _id: user._id.toString(),
       email: user.email,
       role: user.role,
       fullName: userProfile?.fullName || ""
     },
     redirectUrl: "/profilePage"
   });

 } catch (error) {
   console.error("Login error:", error);
   res.status(500).json({ message: "Error logging in" });
 }
}
import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const db = client.db("your-db-name");

    // Fetch all users from the "users" collection
    const users = await db.collection("users").find({}).toArray();

    // Exclude sensitive information like passwords
    const sanitizedUsers = users.map((user) => {
      const { password, ...safeUser } = user;
      return safeUser;
    });

    res.status(200).json({ 
      message: "Users fetched successfully", 
      users: sanitizedUsers 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
}

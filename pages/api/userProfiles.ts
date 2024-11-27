// pages/api/userProfiles.ts
import { NextApiRequest, NextApiResponse } from "next";
import client from "../../lib/mongodb";
import { IUserProfile } from "@/lib/models/userProfile.model";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { ids } = req.query;
    const db = client.db("your-db-name");

    // Convert the comma-separated string of IDs to an array of ObjectIds
    const objectIds = (ids as string).split(",").map((id) => new ObjectId(id));

    // Fetch the user profiles for the provided IDs
    const userProfiles = await db.collection("userProfiles").find({
      _id: { $in: objectIds },
    }).toArray();

    res.status(200).json(userProfiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user profiles" });
  }
}
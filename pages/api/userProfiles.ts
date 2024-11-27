import { NextApiRequest, NextApiResponse } from "next";
import client from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }
  
    try {
      const { ids } = req.query;
      if (!ids) return res.status(400).json({ message: "No IDs provided" });
  
      const db = client.db("your-db-name");
      const userProfiles = await db.collection("userProfiles")
      .find({ userId: { $in: Array.isArray(ids) ? ids : [ids] } })
      .toArray();
  
      res.status(200).json(userProfiles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: String(error) });
    }
  }
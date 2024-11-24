import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const db = client.db("your-db-name");
    const notifications = await db.collection("notifications")
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
}
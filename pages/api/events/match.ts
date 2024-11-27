import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { eventId, volunteerId } = req.body;
    const db = client.db("your-db-name");

    // Get event and volunteer details
    const event = await db.collection("events").findOne({ _id: new ObjectId(eventId) });
    const volunteerData = await db.collection("users").findOne({ _id: new ObjectId(volunteerId) });

    if (!event || !volunteerData) {
      return res.status(404).json({ message: "Event or volunteer not found" });
    }

    // Extract the full name from the volunteer data
    const { profile: { fullName } } = volunteerData;
    

    // Update event with new volunteer
    await db.collection("events").updateOne(
      { _id: new ObjectId(eventId) },
      { $addToSet: { volunteers: volunteerId } }
    );

    // Create notification
    const notification = {
      userId: volunteerId,
      type: 'event_assignment',
      title: 'New Event Assignment',
      message: `You have been assigned to ${event.name}`,
      read: false,
      eventId: eventId,
      createdAt: new Date(),
    };

    await db.collection("notifications").insertOne(notification);

    res.status(200).json({ message: "Volunteer matched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error matching volunteer" });
  }
}
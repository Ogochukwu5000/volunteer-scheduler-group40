import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
// import { authOptions } from "../auth/[...nextauth]";
import { IEvent } from "@/lib/models/event.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
//   const session = await getServerSession(req, res, authOptions);
  
//   if (!session) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

  const db = client.db("your-db-name");
  const eventsCollection = db.collection("events");

  switch (req.method) {
    case "GET":
      try {
        const events = await eventsCollection.find({}).toArray();
        res.status(200).json(events);
      } catch (error) {
        res.status(500).json({ message: "Error fetching events" });
      }
      break;

    case "POST":
      try {
        const eventData: IEvent = {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'upcoming',
          volunteers: [],
        };

        // Validate required fields
        if (!eventData.name || !eventData.description || !eventData.location || 
            !eventData.requiredSkills || !eventData.urgency || !eventData.eventDate) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        const result = await eventsCollection.insertOne(eventData);
        res.status(201).json({ message: "Event created", eventId: result.insertedId });
      } catch (error) {
        res.status(500).json({ message: "Error creating event" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

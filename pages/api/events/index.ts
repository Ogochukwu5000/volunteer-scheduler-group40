import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../lib/mongodb";
import { IEvent } from "@/lib/models/event.model";
import { IUser } from "@/lib/models/users.model";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = client.db("your-db-name");
  const eventsCollection = db.collection("events");
  const usersCollection = db.collection("users");

  switch (req.method) {
    case "GET":
      try {
        const events = await eventsCollection.find({}).toArray();

        // Fetch volunteer data
        const volunteersData = await Promise.all(
          events.flatMap((event) => event.volunteers || []).map(async (volunteerId) => {
            const volunteer = await usersCollection.findOne({ _id: new ObjectId(volunteerId) });
            return { volunteerId, fullName: volunteer?.profile.fullName || "Unknown" };
          })
        );

        const eventsWithVolunteers = events.map((event) => ({
          ...event,
          volunteers: event.volunteers?.map((volunteerId: any) => {
            const volunteerData = volunteersData.find((v) => v.volunteerId === volunteerId);
            return { id: volunteerId, fullName: volunteerData?.fullName || "Unknown" };
          }),
        }));

        res.status(200).json(eventsWithVolunteers);
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
          status: "upcoming",
          volunteers: [],
        };

        // Validate required fields
        if (
          !eventData.name ||
          !eventData.description ||
          !eventData.location ||
          !eventData.requiredSkills ||
          !eventData.urgency ||
          !eventData.eventDate
        ) {
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
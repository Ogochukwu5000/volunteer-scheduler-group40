// @/lib/models/eventVolunteer.model.ts
import { ObjectId } from "mongodb";

export interface IEventVolunteer {
  _id?: ObjectId;
  eventId: ObjectId;
  volunteerId: ObjectId;
  eventName: string;
  eventDate: Date;
  eventCity: string;
  eventState: string;
  role: string;
}
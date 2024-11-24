import { ObjectId } from "mongodb";

export interface IEvent {
    _id?: ObjectId;
    name: string;
    description: string;
    location: string;
    requiredSkills: string[];
    urgency: 'Low' | 'Medium' | 'High' | 'Critical';
    eventDate: Date;
    createdAt: Date;
    updatedAt: Date;
    volunteers?: string[]; // Array of user IDs
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  }
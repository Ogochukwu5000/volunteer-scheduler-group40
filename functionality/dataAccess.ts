import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

export interface Volunteer {
    _id: string;
    fullName: string;
}

export interface Event {
    _id: string;
    eventName: string;
    description: string;
    location: string;
    requiredSkills: string;
    urgency: string;
    eventDate: string;
    createdBy: string;
    createdAt: string;
}

export interface VolunteerHistory {
    volunteerId: string;
    eventId: string;
}

export interface DatabaseData {
    volunteerData: Volunteer[];
    eventData: Event[];
    volunteerHistoryData: VolunteerHistory[];
}

export async function fetchData(): Promise<DatabaseData> {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MongoDB URI not found in environment variables');

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('cluster0');
        
        const volunteers = database.collection<Volunteer>('users');
        const events = database.collection<Event>('events');
        const volunteerHistory = database.collection<VolunteerHistory>('volunteerHistory');

        const [volunteerData, eventData, volunteerHistoryData] = await Promise.all([
            volunteers.find({}).toArray(),
            events.find({}).toArray(),
            volunteerHistory.find({}).toArray()
        ]);

        return { volunteerData, eventData, volunteerHistoryData };
    } finally {
        await client.close();
    }
}
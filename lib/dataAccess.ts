import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

export interface User {
    _id: string;
    email: string;
}

export interface UserProfile {
    _id?: ObjectId;
    userId: string;
    fullName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    skills: string[];
    preferences?: string;
    availability: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Event {
    _id: string;
    eventName: string;
    description: string;
    location: string;
    requiredSkills: string[];  // Changed to array since skills are typically multiple
    urgency: string;
    eventDate: string;
    createdBy: string;
    createdAt: Date;
}

export interface VolunteerHistory {
    userId: string;        // Changed from volunteerId to match your schema
    eventId: string;
    eventName: string;    // Added based on your profile page needs
    eventDate: string;    // Added based on your profile page needs
    eventLocation: string;// Added based on your profile page needs
    role: string;        // Added based on your profile page needs
}

export interface DatabaseData {
    userData: User[];
    userProfiles: UserProfile[];
    eventData: Event[];
    volunteerHistoryData: VolunteerHistory[];
}

export async function fetchData(): Promise<DatabaseData> {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MongoDB URI not found in environment variables');

    const client = new MongoClient(uri);

    try {
        const database = client.db('your-db-name');  // Changed to your actual db name
        
        const users = database.collection<User>('users');
        const userProfiles = database.collection<UserProfile>('userProfiles');
        const events = database.collection<Event>('events');
        const volunteerHistory = database.collection<VolunteerHistory>('volunteerHistory');

        const [userData, profileData, eventData, volunteerHistoryData] = await Promise.all([
            users.find({}).toArray(),
            userProfiles.find({}).toArray(),
            events.find({}).toArray(),
            volunteerHistory.find({}).toArray()
        ]);

        return {
            userData,
            userProfiles: profileData,
            eventData,
            volunteerHistoryData
        };
    } finally {
        await client.close();
    }
}
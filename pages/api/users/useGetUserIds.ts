import { ObjectId } from 'mongodb';
import client from '../../../lib/mongodb';

export async function getUserById(email: string) {
  try {
    await client.connect();
    const db = client.db("your-db-name");
    const user = await db.collection("users").findOne({ email });
    
    return user ? user._id.toString() : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
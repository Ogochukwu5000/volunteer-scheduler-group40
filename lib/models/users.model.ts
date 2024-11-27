import { ObjectId } from "mongodb";

export interface IUser {
  _id?: ObjectId;
  email: string;
  password: string; // Will be hashed
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}
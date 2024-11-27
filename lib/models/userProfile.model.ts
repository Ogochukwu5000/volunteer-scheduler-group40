import { ObjectId } from "mongodb";

export interface IUserProfile {
  _id?: ObjectId;
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
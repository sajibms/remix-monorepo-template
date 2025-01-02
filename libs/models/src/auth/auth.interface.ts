import { Model } from "mongoose";

export interface IUser {
  _id?: string;
  username: string;
  password: string;
}

export type UserModel = Model<IUser>;

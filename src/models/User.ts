import mongoose, { Document, Schema } from "mongoose";

export interface Song extends Document {
  name: string;
  priority: number;
  url: string;
  dedicated_to: string;
}

export interface FavouriteSong extends Document {
  song: string;
  name: string;
}

export const FavouriteSongSchema: Schema<FavouriteSong> = new mongoose.Schema({
  song: { type: String, required: true },
  name: { type: String, required: true },
});

export interface User extends Document {
  name: string;
  about: string;
  image: string;
  favourite_songs: FavouriteSong[];
  email: string;
  password: string;
  rooms: Room[];
  provider: string;
}

export interface Room extends Document {
  name: string;
  roomid: string;
  maxUsers: number;
  users: string[];
  history: Song[];
  songs: Song[];
}

export const RoomSchema: Schema<Room> = new mongoose.Schema({
  name: { type: String, required: true },
  roomid: { type: String, required: true, unique: true },
  maxUsers: { type: Number, required: true },
  users: [{ type: String }],
  history: [{ type: Object }], // Consider using specific type if applicable
  songs: [{ type: Object }], // Consider using specific type if applicable
});

export const UserSchema: Schema<User> = new mongoose.Schema({
  name: { type: String, required: true },
  about: { type: String, required: true },
  image: { type: String, required: true },
  favourite_songs: [FavouriteSongSchema],
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rooms: [RoomSchema],
  provider: { type: String, required: true },
});

const UserModel =
  mongoose.models && mongoose.models.User
    ? (mongoose.models.User as mongoose.Model<User>)
    : mongoose.model<User>("User", UserSchema);

export const RoomModel =
  mongoose.models && mongoose.models.Room
    ? (mongoose.models.Room as mongoose.Model<Room>)
    : mongoose.model<Room>("Room", RoomSchema);

export default UserModel;

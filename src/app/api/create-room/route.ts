import connectDB from "@/lib/connectDB";
import UserModel, { RoomModel } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const CreateRoom = z.object({
  name: z.string(),
  roomid: z.string(),
  email: z.string(),
  maxUsers: z.number(),
});

export async function POST(req: NextRequest) {
  const { email, name, roomid, maxUsers } = CreateRoom.parse(await req.json());

  connectDB();

  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const room = await RoomModel.findOne({ roomid: roomid });

    if (room) {
        return NextResponse.json(
            {
            success: false,
            message: "Room already exists",
            },
            {
            status: 400,
            }
        );
    }

    const newRoom = new RoomModel({
      name: name,
      roomid: roomid,
      maxUsers: maxUsers,
      users: [email],
      history: [],
      songs: [],
    });

    await newRoom.save();

    user.rooms.push(newRoom);

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Room created successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating room",
      },
      {
        status: 500,
      }
    );
  }
}

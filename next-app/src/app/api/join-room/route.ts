import connectDB from "@/lib/connectDB";
import UserModel, { RoomModel } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const JoinRoom = z.object({
  roomid: z.string(),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const { email, roomid } = JoinRoom.parse(await req.json());

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


    


    if (!room) {
        return NextResponse.json(
            {
            success: false,
            message: "No Room Found",
            },
            {
            status: 400,
            }
        );
    }

    if(room.users.includes(email)){
        return NextResponse.json(
            {
            success: false,
            message: "User already in room",
            },
            {
            status: 400,
            }
        );
    }

    if(room.users.length >= room.maxUsers){
        return NextResponse.json(
            {
            success: false,
            message: "Room Full",
            },
            {
            status: 400,
            }
        );
    }

    room.users.push(email);
    await room.save();    
    return NextResponse.json(
      {
        success: true,
        message: "User Added Successfully",
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

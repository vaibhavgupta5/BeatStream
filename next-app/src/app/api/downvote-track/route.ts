import connectDB from "@/lib/connectDB";
import UserModel, { RoomModel } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const Upvote = z.object({
  roomid: z.string(),
  url: z.string().url(),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const { url, email, roomid } = Upvote.parse(await req.json());

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

     
    const song = room.songs.find((song) => song.url === url);
    if (song) {
      
      if(song.priority > 1){
        song.priority -= 1;
      }

        await room.save();
    }
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

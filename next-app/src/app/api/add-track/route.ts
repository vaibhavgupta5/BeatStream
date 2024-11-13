import connectDB from "@/lib/connectDB";
import UserModel, { RoomModel, Song } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const AddTrack = z.object({
  roomid: z.string(),
  by: z.string(),
  dedicated_to: z.string().optional(),
  url: z.string().url(),
  name: z.string(),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const { by, name, dedicated_to, url, email, roomid } = AddTrack.parse(await req.json());

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

    if(!room.users.includes(email)){
        return NextResponse.json(
            {
            success: false,
            message: "User not in Room",
            },
            {
            status: 400,
            }
        );
    }

    if(room.songs.find((song) => song.url === url)){
       
       
        const song = room.songs.find((song) => song.url === url);
        if (song) {
          
            song.priority += 1;
            await room.save();
        }

        return NextResponse.json(
            {
            success: true,
            message: "Song upvoted",
            },
            {
            status: 200,
            }
        );
    }

    const newSong = {
        name: name,
        by: by,
        url: url,
        dedicated_to: dedicated_to,
        priority: Number(room.songs.length + 1) || 1,
    } as unknown as Song;

    room.songs.push(newSong);

    room.users.push(email);
    await room.save();    
    await user.save();

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

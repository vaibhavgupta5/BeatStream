import connectDB from "@/lib/connectDB";
import  { RoomModel, Song } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define the schema for removing a track
const RemoveTrack = z.object({
  roomid: z.string(),
  url: z.string().url(),
});

export async function POST(req: NextRequest) {
  const { url,  roomid } = RemoveTrack.parse(await req.json());

  connectDB();

  try {
   

    // Check if the room exists
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

 

    // Find the song to remove
    const songIndex = room.songs.findIndex((song) => song.url === url);
    if (songIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Song not found in the room",
        },
        {
          status: 404,
        }
      );
    }

    const thissong = room.songs.find((song) => song.url === url);

    room.history.push(thissong as Song);



    // Remove the song from the songs array
    room.songs.splice(songIndex, 1);
    await room.save();

    return NextResponse.json(
      {
        success: true,
        message: "Song removed successfully",
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
        message: "Error removing track",
      },
      {
        status: 500,
      }
    );
  }
}

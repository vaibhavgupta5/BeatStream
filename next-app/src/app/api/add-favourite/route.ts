import connectDB from "@/lib/connectDB";
import UserModel, { FavouriteSong } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const FavTrack = z.object({
  song: z.string().url(),
  name: z.string(),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const {  name, song, email} = FavTrack.parse(await req.json());

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


    const favsong = {
        song: song,
        name: name,
    } as FavouriteSong;

    user.favourite_songs.push(favsong);
   

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Song Added to Favourites",
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

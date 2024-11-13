import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import connectDB from "./lib/connectDB";
import UserModel from "./models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn(params) {
      console.log(params);
      if (!params) {
        return false;
      }

      await connectDB();

      try {
        const user = await UserModel.findOne({ email: params?.user.email });

        if (!user) {
          const newUser = new UserModel({
            name: params?.user.name,
            about: "Enter your bio here",
            image: params?.user.image,
            favourite_songs: [],
            email: params?.user.email,
            password: "ByGoogle",
            rooms: [],
            provider: "Google",
            roomcount: 5,
          });

          await newUser.save();
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});

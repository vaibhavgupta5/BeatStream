import { auth } from "@/auth";
import SignIn from "@/components/sign-in";
 
export default async function Home() {
  const session = await auth();
  console.log(session)
console.log(process.env.AUTH_GOOGLE_ID)
  return (
    <>
    {session ? <h1>Logged in</h1> : <SignIn/>}
    
    </>
  );
}

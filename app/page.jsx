"use client"
import Image from "next/image";
import { Button } from "../components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const {user} = useUser()
  const createUser = useMutation(api.user.createUser)

  useEffect(()=>{
    user && checkUser()
  },[user])

  const checkUser = async ()=>{
 const result = await createUser({
    email:user?.primaryEmailAddress?.emailAddress,
    imageUrl:user?.imageUrl,
    userName:user?.fullName,
    
 });
 console.log(result)
  }

  return (
    <div>
    <div className="flex items-center justify-between p-5" >
      <Image src="/logo.svg" alt="logo" width={140} height={70} />
    {user ? (<Link href="/dashboard"> <Button className="cursor-pointer">DashBoard</Button></Link>) : (<Link className="cursor-pointer" href="/sign-up"> <Button className="cursor-pointer">Get Started</Button></Link>)}  
      
      </div>
      <div className=" text-black h-[80vh] flex flex-col items-center justify-center px-6  ">
       
      <div className="text-center max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Simplify <span className="text-red-500">PDF</span> <span className="text-blue-500">Note</span>-Reading with <span className="text-black">AI-Powered</span>
        </h1>
        <p className="mt-6 text-gray-600 text-lg">
          Elevate your note-taking experience with our AI-powered PDF app. Seamlessly extract key insights, summaries, and annotations from any PDF with just a few clicks.
        </p>
        <div className="mt-6 space-x-4">
        <Link href={user ?"/dashboard":"/sign-up"}>  <button className="bg-black text-white px-6 py-3 rounded-full text-lg">Get started</button> </Link>
          <button className="border border-black text-black px-6 py-3 rounded-full text-lg">Learn more</button>
        </div>
      </div>
      
     
    </div>
      </div>
  );
}

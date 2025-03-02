"use client"
import Image from 'next/image'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import React from 'react'
import Link from 'next/link'

export default function Dashboard() {

  const {user} = useUser()
  const fileList = useQuery(api.fileStorage.GetUserFiles,
    {userEmail:user?.primaryEmailAddress?.emailAddress})
    console.log(fileList)
  return (
    <div>
      
      <h2 className='font-medium text-3xl'>Workspace</h2>
     
        <p className='text-gray-500'>Welcome back, <strong>{user?.fullName}</strong> </p>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-10'>
        {fileList?.length>0?fileList?.map((file,index)=>(
          <Link href={`/workspace/${file?.fileId}`} key={index}>
        <div key={index} 
        className='flex p-5 shadow-md rounded-md flex-col items-center justify-center border cursor-pointer hover:scale-105 transition-all'>
          <Image src="/pdf.png" alt='pdf-img' width={50} height={50}/>
          <h2 className='mt-3 font-medium text-lg'>{file?.fileName}</h2>
          <h2>{file?._creationTime}</h2>
        
        </div>
        </Link>
        )):[1,2,3,4,5,6,7].map((item,index)=>(
          <div className='bg-slate-200 rounded-md h-[150px] animate-pulse' key={index}>
 
          </div>
        ))
        
        }
      </div>
    </div>
  )
}

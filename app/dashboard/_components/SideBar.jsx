"use client" 
import Image from 'next/image'
import React from 'react'
import { Button } from '../../../components/ui/button'
import { Layout, Shield } from 'lucide-react'
import { Progress } from '../../../components/ui/progress'
import UploadPdfDialog from './UploadPdfDialog'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import Link from 'next/link'
import { usePathname } from 'next/navigation'


export default function SideBar() {
    const {user} = useUser()
    const path = usePathname()
const GetUserInfo = useQuery(api.user.GetUserInfo,{userEmail:user?.primaryEmailAddress?.emailAddress})
console.log(GetUserInfo)

    const fileList = useQuery(api.fileStorage.GetUserFiles,
      {userEmail:user?.primaryEmailAddress?.emailAddress})
  return (
    <div className='shadow-md h-screen p-7'>
          <Image  src={"/logo.svg"} alt='logo' width={170} height={170}/>
          <div className='mt-10'>
          <UploadPdfDialog isMaxFile = {(fileList?.length>=5&&!GetUserInfo.upgrade)?true:false } >
             <Button className="w-full">+ Upload PDF</Button>
            </UploadPdfDialog>
            <div className={`flex gap-2 items-center p-3 mt-5 hover:bg-slate-300 rounded-lg cursor-pointer${path == '/dashboard' ? ' bg-slate-400' : ''}`}>
                <Layout/>
                <Link href='/dashboard'>
                <h2>Workspace</h2>
                </Link>
            </div>
            {!GetUserInfo?.upgrade &&  <div className={`flex gap-2 items-center p-3 mt-1 hover:bg-slate-300 rounded-lg cursor-pointer ${path == '/dashboard/upgrade' ? ' bg-slate-400' : ''}`}>
                <Shield/>
                <Link href='/dashboard/upgrade'>
                <h2>Upgrade</h2>
                </Link>
            </div>}
           
          </div>
        {!GetUserInfo?.upgrade && <div className='absolute bottom-24 w-[80%]'>
           <Progress value={(fileList?.length/5)*100} />
           <p className='text-sm mt-1 font-bold'>{fileList?.length} out of 5 PDF Uploaded</p>
           <Link href="/dashboard/upgrade" className='text-xs text-gray-500 mt-3'>Upgrade to upload more PDF</Link>
            </div>
        }
    </div>
  )
}

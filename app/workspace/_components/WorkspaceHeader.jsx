import Image from 'next/image'
import React from 'react'
import { UserButton } from '@clerk/nextjs'
import { Button } from '../../../components/ui/button'
export default function WorkspaceHeader({fileName}) {
  return (
    <div className='p-4 flex justify-between shadow-md'>
        <Image src={"/logo.svg"} width={140} height={140} alt='logo' />
        <h2 className='font-bold text-[30px]'>{fileName}</h2>
        <div className='flex gap-2 items-center '>
          <Button>Save</Button>
          <UserButton/>
        </div>
        
    </div>
  )
}

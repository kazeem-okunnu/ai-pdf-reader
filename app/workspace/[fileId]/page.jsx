"use client"

import WorkspaceHeader from '../_components/WorkspaceHeader'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import PdfViewer from '../_components/PdfViewer'
import {  useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import TextEditor from '../_components/TextEditor'

export default function Workspace() {
    const { fileId } = useParams()
    const fileInfo = useQuery(api.fileStorage.GetFileRecord,{
        fileId:fileId
    })
    useEffect(()=>{
 console.log("fileInfo",fileInfo)
    },[fileInfo])
    
    return (
        <div> 
            <WorkspaceHeader fileName={fileInfo?.fileName}/>
            <div className='grid grid-cols-2 gap-5'>
                <div>
                 {/*Text Editor*/}
                 <TextEditor fileId={fileId}/>
                </div>
                <div>
                {/*Pdf Viewer*/}
                          <PdfViewer fileUrl={fileInfo?.fileUrl}/>
                </div>
            </div>
        </div>
    )
}

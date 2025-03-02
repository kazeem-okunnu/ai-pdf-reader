"use client"

import { DialogClose } from "@radix-ui/react-dialog"
import { Button } from "../../../components/ui/button"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../components/ui/dialog"
  import { Input } from "../../../components/ui/input"
import React, { useState } from 'react'
import { useAction, useMutation } from "convex/react"
import {  Loader2Icon } from "lucide-react"
import { api } from "../../../convex/_generated/api"
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { toast } from "sonner"




export default function UploadPdfDialog({children,isMaxFile}) {
  const router = useRouter()
    const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl)
    const addFileEntry = useMutation(api.fileStorage.AddFileEntryToDb)
    const getFileUrl = useMutation(api.fileStorage.getFileUrl)
    const embeddDocument = useAction(api.myAction.ingest)
    const {user} = useUser()
    const [file,setFile] = useState()
    const [loading,setLoading] = useState(false)
    const [fileName,setFileName] = useState()

    const [open,setOpen] = useState(false)

    const onFileSelect = (event)=>{
        setFile(event.target.files[0])
    }

    const OnUpload = async() =>{
 setLoading(true)
    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
       headers: { "Content-Type": file?.type },
       body: file,
     });
     const { storageId } = await result.json();
     console.log("storageId",storageId)
   const fileId = uuid4()
     const fileUrl = await getFileUrl({storageId:storageId})
         // Step 3: Save the newly allocated storage id to the database
   const resp = await addFileEntry({
       fileId:fileId,
       storageId:storageId,
        fileName:fileName??"Untitled file",
        fileUrl:fileUrl,
       createdBy:user?.primaryEmailAddress?.emailAddress
        
    })
   console.log("resp",resp)

    //api call to fetch pdf process data
    const ApiResp = await axios.get("/api/pdf-loader?pdfUrl="+fileUrl)
    console.log(ApiResp.data.result)
   await embeddDocument({
       splitText:ApiResp.data.result,
       fileId:fileId
    })
   
  setLoading(false)
  setOpen(false)
  toast.success("File uploaded successfully")
  router.push("/workspace/"+fileId)
    }
  return (
    
          <Dialog open={open}>
  <DialogTrigger asChild>
    <Button onClick={()=>setOpen(true)} disabled={isMaxFile} className="w-full">+ Upload PDF File</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Upload PDF File</DialogTitle>
      <DialogDescription asChild>
       <div className="">
       <h2 className="mt-5">Select a file to Upload</h2>
        <div className=" gap-2 p-3 rounded-md border ">
            
            <input type="file" accept="application/pdf" onChange={(event)=>onFileSelect(event)} />
        </div>
        <div className="mt-2">
            <label htmlFor="">File Name*</label>
        <Input placeholder="File name" onChange={(e)=>setFileName(e.target.value)} />
        </div>
        
       </div>
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={OnUpload} disabled={loading}>
            {loading ? (<Loader2Icon className="animate-spin"/>):"Upload"}
            </Button>
        </DialogFooter>
  </DialogContent>
</Dialog>
   
  )
}



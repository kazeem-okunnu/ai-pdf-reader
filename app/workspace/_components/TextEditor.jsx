'use client'

import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect } from 'react'
import EditorExtension from './EditorExtension'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

const TextEditor = ({fileId}) => {

  const notes = useQuery(api.notes.GetNotes,{
    fileId:fileId,

  })
  console.log(notes)

  const editor = useEditor({
    extensions: [StarterKit,
        Highlight.configure({ multicolor: true }),
        Placeholder.configure({
          // Use a placeholder:
          placeholder: 'Start Interacting With Your PDF Document…',}),],
    editorProps :{
        attributes:{
            class:'focus:outline-none h-screen p-5'
        }
    }
  })

  useEffect(()=>{
   editor&& editor.commands.setContent(notes)
  },[notes&&editor])
  
  
  return ( <div> 
     <EditorExtension editor={editor} />
    <div className='overflow-scroll h-[88vh]'>
  <EditorContent editor={editor} />
  </div>
  </div>
)
}

export default TextEditor
import { useUser } from '@clerk/nextjs'
import { chatSession } from '../../../app/configs/AIModel'
import { api } from '../../../convex/_generated/api'
import { useAction } from 'convex/react'
import { useMutation } from 'convex/react'
import { Bold, FlipHorizontal, FoldHorizontal, Heading1, Heading2, Heading3, Highlighter, Italic, List, Minus, Sparkles, Strikethrough, Underline } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

export default function EditorExtension({ editor }) {
const {fileId } = useParams()
  //getting from vector store
  const SearchAI = useAction(api.myAction.search)
  const saveNotes = useMutation(api.notes.saveNotes)
  const {user} = useUser()

  const onAiClick = async () => {
    // Add your AI logic here
    toast("AI is getting your answer...")

    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      " "

    )
    console.log(selectedText)
    const result = await SearchAI({
  query: selectedText,
  fileId: fileId,
    })
    const UnformatttedAns = JSON.parse(result)
    let AllUnformatttedAns = ""
    UnformatttedAns && UnformatttedAns.forEach(item=>{
      AllUnformatttedAns=AllUnformatttedAns+item.pageContent
    })
    const PROMPT = "For question:"+selectedText+" and with the given content as answer," +
    " please give appropriate answer in HTML format . The answer content is: "+AllUnformatttedAns

    const AiModelResult = await  chatSession.sendMessage(PROMPT)
    console.log(AiModelResult.response.text())
  const FinalAns = AiModelResult.response.text().replace("```","").replace("html","").replace("```","")

    const AllText = editor.getHTML()
    editor.commands.setContent(AllText+"<p> <strong>Answer: </strong>"+FinalAns+"</p>")

saveNotes({
  notes:editor.getHTML(),
  fileId:fileId,
  createdBy:user?.primaryEmailAddress?.emailAddress
})
  }
  if (!editor) {
    return null // Return nothing while the editor is initializing
  }

  return (
    <div className='p-5 '>
      <div className="control-group">
        <div className="button-group flex gap-3">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'text-blue-500' : ''}
          >
            <Bold/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'text-blue-500' : ''}
          >
            <Italic/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'text-blue-500' : ''}
          >
            <Heading1/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'text-blue-500' : ''}
          >
           <Heading2/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'text-blue-500' : ''}
          >
            <Heading3/>
          </button>
          <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <Minus/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'text-blue-500' : ''}
          >
            <List/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'text-blue-500' : ''}
          >
            <Underline/>
           
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'text-blue-500' : ''}
          >
            <Strikethrough/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive('highlight') ? 'is-active' : ''}
          >
            <Highlighter/>
          </button>
         
          <button
            onClick={() => onAiClick()}
            className={"text-blue-500 hover:text-blue-800"}
          >
            <Sparkles/>
          </button>
          
        </div>
      </div>
    </div>
  )
}

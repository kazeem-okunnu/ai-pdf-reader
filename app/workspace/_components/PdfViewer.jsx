import React from 'react'

export default function PdfViewer({fileUrl}) {
   
  return (
    <div>
        <iframe src={fileUrl+"#toolbar=0"} width="100%" height="90vh" className='h-[90vh] w-[100%]'></iframe>
    </div>
  )
}

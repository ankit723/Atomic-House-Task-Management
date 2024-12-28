import React from 'react'
import EditPage from '@/components/editPage'

const page = ({params}:{params:{taskId:string}}) => {
  return (
    <EditPage taskId={params.taskId} />
  )
}

export default page
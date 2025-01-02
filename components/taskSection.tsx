'use client'
import { useState } from "react";
import { useGetTasksQuery, useDeleteTaskMutation } from "@/app/graphql/generated"
import { FaSpinner } from "react-icons/fa"
import { BiEdit, BiTrash, BiError } from "react-icons/bi"
import Link from "next/link"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import EditPage from "./editPage"
import CreateTaskSection from "./createTaskSection"
import { Button } from "./ui/button"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";
  

const TaskSection = () => {
    const queryClient = useQueryClient();
    const [modelState, setModalState] = useState(false)
    const [editTask, setEditTask] = useState<any>()
    const [createModelState, setCreateModalState] = useState(false)

    const { data, error }:any = useGetTasksQuery(
        {
            endpoint: process.env.NEXT_PUBLIC_APP_ENDPOINT || "http://localhost:3000/api/graphql",
        }
    )

    const { mutateAsync: deleteTask } = useDeleteTaskMutation(
        {endpoint: process.env.NEXT_PUBLIC_APP_ENDPOINT || "http://localhost:3000/api/graphql",},
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['GetTasks']);
            },
            onError: (error) => {
                console.error("Error deleting task:", error)
            }
        }
    );

    const loading = !data && !error


    if (loading) return <div className="w-screen h-screen flex justify-center items-center"><FaSpinner className=" animate-spin text-7xl text-blue-500"/></div>
    if (error) return 
        <div>
            <BiError className="text-2xl"/>
        </div>

    const handleDeleteTask = async (id: string) => {
        try {
        await deleteTask({ id });
        toast.success("Task deleted successfully");
        console.log("Task deleted successfully");
        } catch (err) {
        console.error("Error deleting task:", err);
        }
    };


    return (
        <div className="text-black">
            <Dialog open={modelState} onOpenChange={setModalState}>
                    <DialogTrigger></DialogTrigger>
                    <DialogContent>
                        <EditPage taskId={editTask?.id} setModelState={setModalState}/>
                    </DialogContent>
                </Dialog>
            <div className="flex justify-between items-center mt-7 mb-10">
                <h1 className="text-2xl font-bold ">Tasks</h1>
                
                <Dialog open={createModelState} onOpenChange={setCreateModalState}>
                    <DialogTrigger><Button>Create new Task</Button></DialogTrigger>
                    <DialogContent>
                        <CreateTaskSection setCreateModalState={setCreateModalState}/>
                    </DialogContent>
                </Dialog>

                
            </div>
            <div className="grid grid-cols-1 gap-4">
                {data?.tasks.map((task:any) => (
                    <div key={task.id} className="bg-white p-4 rounded-md shadow-md hover:shadow-lg cursor-pointer flex justify-between items-center">
                        <div className="">
                            <h1 className="text-lg font-bold">{task.title}</h1>
                            <p>{task.description}</p>
                            <p>Status: <span className="text-blue-500"> {task.status} </span></p>
                        </div>

                        <div className="flex gap-1 items-center">
                            <BiEdit className="text-blue-500 text-2xl" onClick={()=>{
                                setEditTask(task)
                                setModalState(true)
                            }}/>
                            <Button onClick={()=>handleDeleteTask(task.id)}><BiTrash className="text-red-500 text-2xl" /></Button>
                        </div>
                    </div>
                ))}
            </div>
            
        </div>
    )
}

export default TaskSection
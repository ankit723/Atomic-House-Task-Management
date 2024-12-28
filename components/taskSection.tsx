'use client'
import { useGetTasksQuery, useDeleteTaskMutation } from "@/app/graphql/generated"
import { FaSpinner } from "react-icons/fa"
import { BiEdit, BiTrash, BiError } from "react-icons/bi"
import Link from "next/link"
import { url } from "inspector"

const TaskSection = () => {
    const { data, error }:any = useGetTasksQuery(
        {
            endpoint: process.env.APP_ENDPOINT || "http://localhost:3000/api/graphql",
        }
    )

    const { mutateAsync: deleteTask } = useDeleteTaskMutation(
        {endpoint: process.env.APP_ENDPOINT || "http://localhost:3000/api/graphql",}
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
        window.location.reload();
        console.log("Task deleted successfully");
        } catch (err) {
        console.error("Error deleting task:", err);
        }
    };


    return (
        <div className="text-black">
            <div className="flex justify-between items-center mt-7 mb-10">
                <h1 className="text-2xl font-bold ">Tasks</h1>

                <Link className="bg-blue-500 text-white p-3 rounded-md" href={`/create-task`}>Create new Task</Link>
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
                            <Link href={`/edit-task/${task.id}`}><BiEdit className="text-blue-500 text-2xl" /></Link>
                            <button onClick={()=>handleDeleteTask(task.id)}><BiTrash className="text-red-500 text-2xl" /></button>
                        </div>
                    </div>
                ))}
            </div>
            
        </div>
    )
}

export default TaskSection
'use client'
import React, { useState, useEffect } from "react";
import { useGetTasksQuery } from "@/app/graphql/generated";
import { useUpdateTaskMutation } from "@/app/graphql/generated";
import { FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useQueryClient } from "@tanstack/react-query";








const EditPage = ({ taskId, setModelState }: { taskId: string, setModelState:any }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data, error, isSuccess } = useGetTasksQuery(
    {endpoint: process.env.NEXT_PUBLIC_APP_ENDPOINT || "http://localhost:3000/api/graphql",},
    {id: taskId},
  );

  const { mutateAsync: updateTask } = useUpdateTaskMutation(
    {endpoint: process.env.NEXT_PUBLIC_APP_ENDPOINT || "http://localhost:3000/api/graphql"},
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['GetTasks']);
      },
      onError: (error) => {
        console.error('Failed to update task:', error);
      },
    }
  );

  useEffect(() => {
    if (isSuccess && data?.task) {
      const task = data.task;
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "");
      console.log(task)
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (error) {
      console.error("Error loading task:", error);
    }
    console.log(status)
  }, [status, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await updateTask({
        id: taskId,
        title,
        description,
        status,
      });
      toast.success("Task updated successfully!");
    } catch (err) {
      console.error("Error updating task:", err);
      setErrorMessage("Failed to update task. Please try again.");
    } finally {
      setIsSubmitting(false);
      setModelState(false)
    }
  };

  if (!data) return <div className=" flex justify-center items-center"><FaSpinner className=" animate-spin text-7xl text-blue-500"/></div>;
  if (error) return <div>Error loading task: {error.message}</div>;

  return (
    <div className="text-black">
      <h1 className="text-2xl font-bold mb-4">Edit Task</h1>
      {errorMessage && (
        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ></Textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value)} // Use onValueChange instead of onChange
            required
          >
            <SelectTrigger >
              <SelectValue placeholder={status} /> {/* Optional placeholder */}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODO">Todo</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          variant={'default'}
          className="w-full"
        >
          {isSubmitting ? "Updating..." : "Update Task"}
        </Button>
      </form>
    </div>
  );
};

export default EditPage;

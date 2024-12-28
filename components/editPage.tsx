'use client'
import React, { useState, useEffect } from "react";
import { useGetTasksQuery } from "@/app/graphql/generated";
import { useUpdateTaskMutation } from "@/app/graphql/generated";
import { FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";

const EditPage = ({ taskId }: { taskId: string }) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data, error, isSuccess } = useGetTasksQuery(
    {endpoint: process.env.APP_ENDPOINT || "http://localhost:3000/api/graphql",},
    {id: taskId},
  );

  const { mutateAsync: updateTask } = useUpdateTaskMutation({
    endpoint: process.env.APP_ENDPOINT || "http://localhost:3000/api/graphql",
  });

  useEffect(() => {
    if (isSuccess && data?.task) {
      const task = data.task;
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "Pending");
    }
  }, [data, isSuccess]);

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
      alert("Task updated successfully!");
      router.push("/");
    } catch (err) {
      console.error("Error updating task:", err);
      setErrorMessage("Failed to update task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!data) return <div className="w-screen h-screen flex justify-center items-center"><FaSpinner className=" animate-spin text-7xl text-blue-500"/></div>;
  if (error) return <div>Error loading task: {error.message}</div>;

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-md shadow-md text-black">
      <h1 className="text-2xl font-bold mb-4">Edit Task</h1>
      {errorMessage && (
        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Update Task"}
        </button>
      </form>
    </div>
  );
};

export default EditPage;

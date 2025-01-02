'use client';
import React, { useState } from "react";
import { useCreateTaskMutation } from "@/app/graphql/generated";
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

const CreateTaskSection = ({setCreateModalState}:{setCreateModalState:any}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: createTask } = useCreateTaskMutation(
    {endpoint: process.env.NEXT_PUBLIC_APP_ENDPOINT || "http://localhost:3000/api/graphql"},
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['GetTasks']);
      },
      onError: (error) => {
        console.error("Failed to create task:", error);
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const variables = {
        title,
        description,
        status
      };
      await createTask(variables);
      setTitle("");
      setDescription("");
      setStatus("Pending");
      toast.success("Task created successfully!");
    } catch (error) {
      toast.error("Failed to create task. Please try again.");
      console.error("Error creating task:", error);
      setErrorMessage("Failed to create task. Please try again.");
    } finally {
      setIsLoading(false);
      setCreateModalState(false);
    }
  };

  return (
    <div className="text-black">
      <h1 className="text-2xl font-bold mb-4">Create Task</h1>
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
            placeholder="Enter task title"
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
            placeholder="Enter task description"
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
              <SelectValue placeholder="Select status" /> {/* Optional placeholder */}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODO">Todo</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            >
            {isLoading ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskSection;

"use client";

import React, { useState } from "react";
import { ProjectRoom, ProjectRoomUser } from "../../../lib/Types";
import { useAuth } from "@clerk/nextjs";
import Members from "../dashboard/Members";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import "react-datepicker/dist/react-datepicker.css";
import MyTasks from "./MyTasks";

function Tasks({ projectRoom }: { projectRoom: ProjectRoom }) {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const users: ProjectRoomUser[] = projectRoom.users || [];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  const isUserAdmin = (userId: string, users: ProjectRoomUser[]): boolean => {
    const user = users.find((user) => user.userId === userId);
    return user?.role === "admin";
  };

  console.log(projectRoom);
  const createNewTask = useMutation({
    mutationFn: (taskData: {
      projectRoomId: string;
      title: string;
      description: string;
      priority: string;
      assigneeId: string;
    }) => axios.post("/api/projectroom-routes/tasks/create-new-task", taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectRoom", projectRoom.id],
      });
      // Reset form fields
      setTitle("");
      setDescription("");
      setPriority("");
      setAssigneeId("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNewTask.mutate({
      projectRoomId: projectRoom.id,
      title,
      description,
      priority,
      assigneeId,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Members</CardTitle>
          <CardDescription>
            List of all members in this project room
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
      <MyTasks />
      {isUserAdmin(userId!, users) && (
        <Card>
          <CardHeader>
            <CardTitle>Assign New Task</CardTitle>
            <CardDescription>
              Create a new task and assign it to a team member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority} required>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assignee">Assign to</Label>
                <Select
                  value={assigneeId}
                  onValueChange={setAssigneeId}
                  required
                >
                  <SelectTrigger id="assignee">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.first_name} {user.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={createNewTask.isPending}>
                {createNewTask.isPending ? "Creating..." : "Create Task"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Tasks;

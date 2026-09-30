"use client";

import { useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import TaskCard from "../../components/TaskCard";

export default function TasksPage() {
const { tasks, setTasks } = useAppContext();

  const [taskTitle, setTaskTitle] = useState("");

  // Add Task
  const addTask = () => {
    if (taskTitle.trim() === "") return;

    const newTask = {
      id: Date.now(),
      title: taskTitle,
      status: "Pending",
    };

    setTasks([...tasks, newTask]);
    setTaskTitle("");
  };

  // Delete Task
  const deleteTask = (id) => {
    setTasks(
      tasks.filter((task) => task.id !== id)
    );
  };

  // Update Task Status
  const updateTaskStatus = (id, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    );
  };

  return (
    <main>
      <h1>Tasks</h1>

      <input
        type="text"
        placeholder="Enter task"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />

      <button onClick={addTask}>
        Add Task
      </button>

      <div>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={deleteTask}
            onStatusChange={updateTaskStatus}
          />
        ))}
      </div>
    </main>
  );
}
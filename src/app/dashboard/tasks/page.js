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
      title: taskTitle.trim(),
      status: "Pending",
    };

    setTasks([...tasks, newTask]);
    setTaskTitle("");
  };

  // Delete Task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Update Task Status
  const updateTaskStatus = (id, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <main className="mx-auto w-full max-w-7xl min-w-0 p-3 sm:p-6">
      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Tasks
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track your work and update task status.
        </p>
      </div>

      {/* Add Task */}
      <form
        className="mb-6 flex min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5"
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
      >
        <input
          type="text"
          placeholder="Enter task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          aria-label="Task title"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="submit"
          disabled={!taskTitle.trim()}
          className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          Add Task
        </button>
      </form>

      {/* Task count */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          All Tasks
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </p>
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
          <h3 className="text-lg font-semibold text-slate-800">
            No tasks yet
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Add your first task using the form above.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="min-w-0">
              <TaskCard
                task={task}
                onDelete={deleteTask}
                onStatusChange={updateTaskStatus}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
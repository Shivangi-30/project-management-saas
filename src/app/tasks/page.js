"use client";

import { useState } from "react";

import { useAppContext } from "../../context/AppContext";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function TasksPage() {
  const { tasks, setTasks } = useAppContext();

  const [taskTitle, setTaskTitle] = useState("");

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

  const deleteTask = (id) => {
    setTasks(
      tasks.filter((task) => task.id !== id)
    );
  };

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
    <main className="min-h-screen bg-slate-100 pl-64">
      <Sidebar />

      <section className="min-h-screen">
        <Header />

        <div className="p-6">

          {/* Page Heading */}

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800">
              Tasks
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage and track all your tasks.
            </p>
          </div>

          {/* Add Task */}

          <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              Add New Task
            </h2>

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter task title"
                value={taskTitle}
                onChange={(e) =>
                  setTaskTitle(e.target.value)
                }
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                onClick={addTask}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Add Task
              </button>
            </div>
          </div>

          {/* Tasks List */}

          {tasks.length === 0 ? (
            <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800">
                No Tasks Found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Add your first task above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-4">

                    {/* Task Information */}

                    <div>
                      <h3 className="text-base font-semibold text-slate-800">
                        {task.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Task ID: {task.id}
                      </p>
                    </div>

                    {/* Actions */}

                    <div className="flex items-center gap-3">

                      <select
                        value={task.status}
                        onChange={(e) =>
                          updateTaskStatus(
                            task.id,
                            e.target.value
                          )
                        }
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="In Progress">
                          In Progress
                        </option>

                        <option value="Completed">
                          Completed
                        </option>
                      </select>

                      <button
                        onClick={() =>
                          deleteTask(task.id)
                        }
                        className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
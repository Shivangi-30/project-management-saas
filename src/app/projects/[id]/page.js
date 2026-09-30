"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { useAppContext } from "../../../context/AppContext";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function ProjectDetails() {
  const params = useParams();

  const {
    projects,
    tasks,
    setTasks,
  } = useAppContext();

  const [taskTitle, setTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Find current project
  const project = projects.find(
    (item) => item.id === Number(params.id)
  );

  // Get only tasks belonging to this project
  const projectTasks = tasks.filter(
    (task) => task.projectId === project?.id
  );

  // Project not found
  if (!project) {
    return (
      <main className="min-h-screen bg-slate-100 p-10">
        <h1 className="text-2xl font-bold text-red-600">
          Project not found
        </h1>

        <Link
          href="/projects"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          ← Back to Projects
        </Link>
      </main>
    );
  }

  // Add Task
  const addTask = () => {
    if (taskTitle.trim() === "") return;

    const newTask = {
      id: Date.now(),
      title: taskTitle,
      status: "Pending",
      projectId: project.id,
    };

    setTasks([...tasks, newTask]);

    setTaskTitle("");
  };

  // Delete Task
  const deleteTask = (taskId) => {
    setTasks(
      tasks.filter((task) => task.id !== taskId)
    );
  };

  // Complete / Undo Task
  const toggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status:
                task.status === "Completed"
                  ? "Pending"
                  : "Completed",
            }
          : task
      )
    );
  };

  // Edit Task
  const editTask = (task) => {
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
  };

  // Update Task
  const updateTask = () => {
    if (taskTitle.trim() === "") return;

    setTasks(
      tasks.map((task) =>
        task.id === editingTaskId
          ? {
              ...task,
              title: taskTitle,
            }
          : task
      )
    );

    setEditingTaskId(null);
    setTaskTitle("");
  };

  return (
    <main className="min-h-screen bg-slate-100 pl-64">
      <Sidebar />

      <section className="min-h-screen">
        <Header />

        <div className="p-6">

          {/* Back Button */}
          <Link
            href="/projects"
            className="mb-6 inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Projects
          </Link>

          {/* Project Details */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">

              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {project.name}
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  {project.description}
                </p>
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                {project.status}
              </span>

            </div>
          </div>

          {/* Tasks Section */}
          <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Tasks
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage tasks for this project.
                </p>
              </div>

              <span className="text-sm text-slate-500">
                {projectTasks.length} Tasks
              </span>

            </div>

            {/* Add / Edit Task Form */}
            <div className="mt-5 flex gap-3">

              <input
                type="text"
                placeholder="Enter task title"
                value={taskTitle}
                onChange={(e) =>
                  setTaskTitle(e.target.value)
                }
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              />

              <button
                onClick={
                  editingTaskId
                    ? updateTask
                    : addTask
                }
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                {editingTaskId
                  ? "Update Task"
                  : "Add Task"}
              </button>

              {/* Cancel Edit */}
              {editingTaskId && (
                <button
                  onClick={() => {
                    setEditingTaskId(null);
                    setTaskTitle("");
                  }}
                  className="rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700"
                >
                  Cancel
                </button>
              )}

            </div>

            {/* Task List */}
            <div className="mt-5">

              {projectTasks.length > 0 ? (

                <div className="space-y-3">

                  {projectTasks.map((task) => (

                    <div
                      key={task.id}
                      className="flex items-center justify-between rounded-lg border bg-slate-50 p-4"
                    >

                      {/* Task Information */}
                      <div className="flex-1">

                        <p
                          className={`font-medium ${
                            task.status === "Completed"
                              ? "text-slate-400 line-through"
                              : "text-slate-800"
                          }`}
                        >
                          {task.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {task.status}
                        </p>

                      </div>

                      {/* Task Actions */}
                      <div className="flex items-center gap-2">

                        {/* Edit */}
                        <button
                          onClick={() => editTask(task)}
                          className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700"
                        >
                          Edit
                        </button>

                        {/* Complete / Undo */}
                        <button
                          onClick={() =>
                            toggleTask(task.id)
                          }
                          className="rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700"
                        >
                          {task.status === "Completed"
                            ? "Undo"
                            : "Complete"}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() =>
                            deleteTask(task.id)
                          }
                          className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="rounded-lg border border-dashed p-8 text-center">

                  <p className="text-sm text-slate-500">
                    No tasks found for this project.
                  </p>

                </div>

              )}

            </div>

          </div>

        </div>
      </section>
    </main>
  );
}
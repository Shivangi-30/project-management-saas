"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function ProjectDetails() {
  const params = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [taskTitle, setTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Fetch Project and Tasks
  useEffect(() => {
    async function fetchProjectAndTasks() {
      try {
        setLoading(true);
        setError("");

        // Fetch single project
        const projectResponse = await fetch(
          `/api/projects/${params.id}`
        );

        const projectData = await projectResponse.json();

        if (!projectResponse.ok) {
          setError(projectData.message || "Project not found");
          return;
        }

        setProject(projectData.project);

        // Fetch all user's tasks
        const tasksResponse = await fetch("/api/tasks");

        const tasksData = await tasksResponse.json();

        if (!tasksResponse.ok) {
          setError(tasksData.message || "Failed to fetch tasks");
          return;
        }

        // Only tasks belonging to this project
        const relatedTasks = tasksData.tasks.filter(
          (task) =>
            task.projectId?._id === projectData.project._id
        );

        setTasks(relatedTasks);
      } catch (error) {
        console.error(
          "Fetch Project Details Error:",
          error
        );

        setError("Something went wrong while loading the project.");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchProjectAndTasks();
    }
  }, [params.id]);

  // Loading State
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 pl-64">
        <Sidebar />

        <section className="min-h-screen">
          <Header />

          <div className="p-6">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Loading project...
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Error / Project Not Found
  if (error || !project) {
    return (
      <main className="min-h-screen bg-slate-100 pl-64">
        <Sidebar />

        <section className="min-h-screen">
          <Header />

          <div className="p-6">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-red-600">
                {error || "Project not found"}
              </h1>

              <Link
                href="/projects"
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                ← Back to Projects
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Add Task
  async function addTask() {
    if (taskTitle.trim() === "") return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: project._id,
          title: taskTitle.trim(),
          description: "",
          status: "Pending",
          priority: "Medium",
          dueDate: null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to create task");
        return;
      }

      setTasks((currentTasks) => [
        data.task,
        ...currentTasks,
      ]);

      setTaskTitle("");
    } catch (error) {
      console.error("Add Task Error:", error);
      alert("Something went wrong while adding the task.");
    }
  }

  // Delete Task
  async function deleteTask(taskId) {
    try {
      const response = await fetch(
        `/api/tasks/${taskId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete task");
        return;
      }

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task._id !== taskId
        )
      );
    } catch (error) {
      console.error("Delete Task Error:", error);
      alert("Something went wrong while deleting the task.");
    }
  }

  // Complete / Undo Task
  async function toggleTask(task) {
    const newStatus =
      task.status === "Completed"
        ? "Pending"
        : "Completed";

    try {
      const response = await fetch(
        `/api/tasks/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId: project._id,
            title: task.title,
            description: task.description || "",
            status: newStatus,
            priority: task.priority || "Medium",
            dueDate: task.dueDate || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update task");
        return;
      }

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask._id === task._id
            ? data.task
            : currentTask
        )
      );
    } catch (error) {
      console.error("Toggle Task Error:", error);
      alert("Something went wrong while updating the task.");
    }
  }

  // Edit Task
  function editTask(task) {
    setEditingTaskId(task._id);
    setTaskTitle(task.title);
  }

  // Update Task
  async function updateTask() {
    if (taskTitle.trim() === "") return;

    const currentTask = tasks.find(
      (task) => task._id === editingTaskId
    );

    if (!currentTask) return;

    try {
      const response = await fetch(
        `/api/tasks/${editingTaskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId: project._id,
            title: taskTitle.trim(),
            description: currentTask.description || "",
            status: currentTask.status || "Pending",
            priority: currentTask.priority || "Medium",
            dueDate: currentTask.dueDate || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update task");
        return;
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === editingTaskId
            ? data.task
            : task
        )
      );

      setEditingTaskId(null);
      setTaskTitle("");
    } catch (error) {
      console.error("Update Task Error:", error);
      alert("Something went wrong while updating the task.");
    }
  }

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
                {tasks.length} Tasks
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
                type="button"
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

              {editingTaskId && (
                <button
                  type="button"
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
              {tasks.length > 0 ? (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task._id}
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
                          type="button"
                          onClick={() =>
                            editTask(task)
                          }
                          className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700"
                        >
                          Edit
                        </button>

                        {/* Complete / Undo */}
                        <button
                          type="button"
                          onClick={() =>
                            toggleTask(task)
                          }
                          className="rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700"
                        >
                          {task.status === "Completed"
                            ? "Undo"
                            : "Complete"}
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() =>
                            deleteTask(task._id)
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
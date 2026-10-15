
"use client";

import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Add Task fields
  const [taskTitle, setTaskTitle] = useState("");
  const [projectId, setProjectId] = useState("");

  // Edit Task fields
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editProjectId, setEditProjectId] = useState("");
  const [editStatus, setEditStatus] = useState("Pending");
  const [editPriority, setEditPriority] = useState("Medium");
  const [editDueDate, setEditDueDate] = useState("");

  // Loading and action states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Search, filters and sorting
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  // Fetch Projects and Tasks
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        const [projectsResponse, tasksResponse] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/tasks"),
        ]);

        const projectsData = await projectsResponse.json();
        const tasksData = await tasksResponse.json();

        if (!projectsResponse.ok) {
          throw new Error(
            projectsData.message || "Failed to fetch projects"
          );
        }

        if (!tasksResponse.ok) {
          throw new Error(
            tasksData.message || "Failed to fetch tasks"
          );
        }

        const formattedProjects = projectsData.projects.map((project) => ({
          ...project,
          id: project._id,
        }));

        const formattedTasks = tasksData.tasks.map((task) => ({
          ...task,
          id: task._id,
        }));

        setProjects(formattedProjects);
        setTasks(formattedTasks);
      } catch (error) {
        console.error("Fetch Tasks Data Error:", error);
        setError(error.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Add Task
  const addTask = async () => {
    if (taskTitle.trim() === "") {
      setError("Task title is required.");
      return;
    }

    if (!projectId) {
      setError("Please select a project.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          title: taskTitle.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create task");
      }

      const newTask = {
        ...data.task,
        id: data.task._id,
      };

      setTasks((currentTasks) => [newTask, ...currentTasks]);
      setTaskTitle("");
      setProjectId("");
    } catch (error) {
      console.error("Add Task Error:", error);
      setError(error.message || "Failed to create task");
    } finally {
      setSaving(false);
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete task");
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );
    } catch (error) {
      console.error("Delete Task Error:", error);
      setError(error.message || "Failed to delete task");
    } finally {
      setDeletingId(null);
    }
  };

  // Start Edit Task
  const startEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title || "");
    setEditDescription(task.description || "");

    setEditProjectId(
      task.projectId?._id || task.projectId || ""
    );

    setEditStatus(task.status || "Pending");
    setEditPriority(task.priority || "Medium");

    if (task.dueDate) {
      setEditDueDate(new Date(task.dueDate).toISOString().split("T")[0]);
    } else {
      setEditDueDate("");
    }

    setError("");
  };

  // Cancel Edit
  const cancelEditTask = () => {
    setEditingTaskId(null);
    setEditTitle("");
    setEditDescription("");
    setEditProjectId("");
    setEditStatus("Pending");
    setEditPriority("Medium");
    setEditDueDate("");
    setError("");
  };

  // Update Full Task
  const updateTask = async () => {
    if (editTitle.trim() === "") {
      setError("Task title is required.");
      return;
    }

    if (!editProjectId) {
      setError("Please select a project.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`/api/tasks/${editingTaskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: editProjectId,
          title: editTitle.trim(),
          description: editDescription,
          status: editStatus,
          priority: editPriority,
          dueDate: editDueDate || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update task");
      }

      const updatedTask = {
        ...data.task,
        id: data.task._id,
      };

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTaskId ? updatedTask : task
        )
      );

      cancelEditTask();
    } catch (error) {
      console.error("Update Task Error:", error);
      setError(error.message || "Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  // Update Task Status
  const updateTaskStatus = async (task, newStatus) => {
    const selectedProjectId = task.projectId?._id || task.projectId;

    if (!selectedProjectId) {
      setError(
        "This task is not linked to a project. Please edit the task and select a project."
      );
      return;
    }

    try {
      setUpdatingId(task.id);
      setError("");

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: selectedProjectId,
          title: task.title,
          description: task.description || "",
          status: newStatus,
          priority: task.priority || "Medium",
          dueDate: task.dueDate || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update task");
      }

      const updatedTask = {
        ...data.task,
        id: data.task._id,
      };

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id ? updatedTask : currentTask
        )
      );
    } catch (error) {
      console.error("Update Task Error:", error);
      setError(error.message || "Failed to update task");
    } finally {
      setUpdatingId(null);
    }
  };

  // Search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = (task.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort filtered tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "Newest") {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }

    if (sortBy === "Oldest") {
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    }

    if (sortBy === "Due Date") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }

    if (sortBy === "Priority") {
      const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3,
      };

      return (
        (priorityOrder[a.priority] || 4) -
        (priorityOrder[b.priority] || 4)
      );
    }

    return 0;
  });

  return (
    <main className="min-h-screen overflow-x-clip bg-slate-100 md:pl-64">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <section className="min-h-screen min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <div className="min-w-0 p-3 sm:p-6">
          {/* Page Heading */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-800 sm:text-2xl lg:text-3xl">
              Tasks
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage and track all your tasks.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mb-6 break-words rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {/* Add Task */}
          <div className="mb-6 min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              Add New Task
            </h2>

            <div className="flex min-w-0 flex-col gap-3 sm:gap-4 md:flex-row">
              <select
                aria-label="Select project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:flex-1"
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                aria-label="Task title"
                placeholder="Enter task title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={addTask}
                disabled={saving || loading || projects.length === 0}
                className="w-full shrink-0 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
              >
                {saving ? "Adding..." : "Add Task"}
              </button>
            </div>

            {projects.length === 0 && !loading && (
              <p className="mt-3 text-sm text-amber-600">
                Please create a project first before adding a task.
              </p>
            )}
          </div>

          {/* Search and Filters */}
          {!loading && tasks.length > 0 && (
            <div className="mb-5 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
              <input
                type="text"
                aria-label="Search tasks"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <select
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                aria-label="Filter by priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <select
                aria-label="Sort tasks"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
                <option value="Due Date">Due Date</option>
                <option value="Priority">Priority</option>
              </select>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="rounded-xl border bg-white p-8 text-center shadow-sm sm:p-10">
              <p className="text-sm text-slate-500">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="rounded-xl border bg-white p-8 text-center shadow-sm sm:p-10">
              <h2 className="text-lg font-semibold text-slate-800">
                No Tasks Found
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Add your first task above.
              </p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="rounded-xl border bg-white p-8 text-center shadow-sm sm:p-10">
              <h2 className="text-lg font-semibold text-slate-800">
                No Matching Tasks Found
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Try a different search term or filter.
              </p>
            </div>
          ) : (
            /* Tasks List */
            <div className="min-w-0 space-y-4">
              {sortedTasks.map((task) => (
                <div
                  key={task.id}
                  className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                >
                  {editingTaskId === task.id ? (
                    /* Edit Task Form */
                    <div className="min-w-0">
                      <h3 className="mb-5 text-lg font-semibold text-slate-800">
                        Edit Task
                      </h3>

                      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="min-w-0">
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Task Title
                          </label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full min-w-0 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>

                        <div className="min-w-0">
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Project
                          </label>
                          <select
                            value={editProjectId}
                            onChange={(e) => setEditProjectId(e.target.value)}
                            className="w-full min-w-0 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          >
                            <option value="">Select Project</option>
                            {projects.map((project) => (
                              <option key={project.id} value={project.id}>
                                {project.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="min-w-0 sm:col-span-2">
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Description
                          </label>
                          <textarea
                            rows={3}
                            value={editDescription}
                            onChange={(e) =>
                              setEditDescription(e.target.value)
                            }
                            placeholder="Enter task description"
                            className="w-full min-w-0 resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>

                        <div className="min-w-0">
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Status
                          </label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="w-full min-w-0 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>

                        <div className="min-w-0">
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Priority
                          </label>
                          <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value)}
                            className="w-full min-w-0 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        </div>

                        <div className="min-w-0">
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Due Date
                          </label>
                          <input
                            type="date"
                            value={editDueDate}
                            onChange={(e) => setEditDueDate(e.target.value)}
                            className="w-full min-w-0 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>

                      {/* Edit Actions */}
                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={updateTask}
                          disabled={saving}
                          className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                          {saving ? "Updating..." : "Update Task"}
                        </button>

                        <button
                          type="button"
                          onClick={cancelEditTask}
                          disabled={saving}
                          className="w-full rounded-lg bg-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-300 disabled:opacity-50 sm:w-auto"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Normal Task View */
                    <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      {/* Task Information */}
                      <div className="min-w-0 flex-1 break-words">
                        <h3 className="break-words text-base font-semibold text-slate-800">
                          {task.title}
                        </h3>

                        <p className="mt-1 break-words text-sm text-slate-500">
                          Project: {task.projectId?.name || "Unknown Project"}
                        </p>

                        {task.description && (
                          <p className="mt-1 break-words text-sm text-slate-500">
                            Description: {task.description}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-slate-400">
                          Priority: {task.priority || "Medium"}
                        </p>

                        {task.dueDate && (
                          <p className="mt-1 text-xs text-slate-400">
                            Due Date:{" "}
                            {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}

                        <p className="mt-1 break-all text-xs text-slate-400">
                          Task ID: {task.id}
                        </p>
                      </div>

                      {/* Task Actions */}
                      <div className="flex min-w-0 flex-wrap items-center gap-2 md:justify-end">
                        <select
                          aria-label={`Status for ${task.title}`}
                          value={task.status || "Pending"}
                          disabled={updatingId === task.id}
                          onChange={(e) =>
                            updateTaskStatus(task, e.target.value)
                          }
                          className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 disabled:opacity-50 sm:w-auto"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => startEditTask(task)}
                          className="shrink-0 rounded-lg px-3 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={deletingId === task.id}
                          onClick={() => deleteTask(task.id)}
                          className="shrink-0 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === task.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

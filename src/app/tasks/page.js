"use client";

import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

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

        const [projectsResponse, tasksResponse] =
          await Promise.all([
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

        const formattedProjects = projectsData.projects.map(
          (project) => ({
            ...project,
            id: project._id,
          })
        );

        const formattedTasks = tasksData.tasks.map((task) => ({
          ...task,
          id: task._id,
        }));

        setProjects(formattedProjects);
        setTasks(formattedTasks);
      } catch (error) {
        console.error("Fetch Tasks Data Error:", error);

        setError(
          error.message || "Failed to load tasks"
        );
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
          title: taskTitle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create task"
        );
      }

      const newTask = {
        ...data.task,
        id: data.task._id,
      };

      setTasks((currentTasks) => [
        newTask,
        ...currentTasks,
      ]);

      setTaskTitle("");
      setProjectId("");
    } catch (error) {
      console.error("Add Task Error:", error);

      setError(
        error.message || "Failed to create task"
      );
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
        throw new Error(
          data.message || "Failed to delete task"
        );
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );
    } catch (error) {
      console.error("Delete Task Error:", error);

      setError(
        error.message || "Failed to delete task"
      );
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
      setEditDueDate(
        new Date(task.dueDate)
          .toISOString()
          .split("T")[0]
      );
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

      const response = await fetch(
        `/api/tasks/${editingTaskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId: editProjectId,
            title: editTitle,
            description: editDescription,
            status: editStatus,
            priority: editPriority,
            dueDate: editDueDate || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update task"
        );
      }

      const updatedTask = {
        ...data.task,
        id: data.task._id,
      };

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTaskId
            ? updatedTask
            : task
        )
      );

      cancelEditTask();
    } catch (error) {
      console.error("Update Task Error:", error);

      setError(
        error.message || "Failed to update task"
      );
    } finally {
      setSaving(false);
    }
  };

  // Update Task Status
  // Update Task Status
const updateTaskStatus = async (task, newStatus) => {
  const selectedProjectId =
    task.projectId?._id || task.projectId;

  if (!selectedProjectId) {
    setError(
      "This task is not linked to a project. Please edit the task and select a project."
    );
    return;
  }

  try {
    setUpdatingId(task.id);
    setError("");

    const response = await fetch(
      `/api/tasks/${task.id}`,
      {
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
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update task"
      );
    }

    const updatedTask = {
      ...data.task,
      id: data.task._id,
    };

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === task.id
          ? updatedTask
          : currentTask
      )
    );
  } catch (error) {
    console.error("Update Task Error:", error);

    setError(
      error.message || "Failed to update task"
    );
  } finally {
    setUpdatingId(null);
  }
};

  // Search + Status + Priority Filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "Newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortBy === "Oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }

    if (sortBy === "Due Date") {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }

    if (sortBy === "Priority") {
      const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3,
      };

      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    return 0;
  });
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

          {/* Error Message */}

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Add Task */}

          <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">

            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              Add New Task
            </h2>

            <div className="flex flex-col gap-4 md:flex-row">

              {/* Project Select */}


              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select Project</option>

                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              {/* Task Title */}

              <input
                type="text"
                placeholder="Enter task title"
                value={taskTitle}
                onChange={(e) =>
                  setTaskTitle(e.target.value)
                }
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {/* Add Button */}

              <button
                type="button"
                onClick={addTask}
                disabled={
                  saving || projects.length === 0
                }
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Adding..." : "Add Task"}
              </button>

            </div>

            {projects.length === 0 && !loading && (
              <p className="mt-3 text-sm text-amber-600">
                Please create a project first before
                adding a task.
              </p>
            )}

          </div>


          {/* Search and Filters */}
          {!loading && tasks.length > 0 && (
            <div className="mb-5 grid gap-4 md:grid-cols-4">
              {/* Search */}
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
            <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-slate-500">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            /* No Tasks */
            <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800">
                No Tasks Found
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Add your first task above.
              </p>
            </div>
          ) : filteredTasks.length === 0 ? (
            /* No Matching Tasks */
            <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800">
                No Matching Tasks Found
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Try a different search term.
              </p>
            </div>
          ) : (
            /* Tasks List */
            <div className="space-y-4">

              {filteredTasks.map((task) => (

                <div
                  key={task.id}
                  className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
                >

                  {editingTaskId === task.id ? (

                    /* Edit Task Form */

                    <div>

                      <h3 className="mb-5 text-lg font-semibold text-slate-800">
                        Edit Task
                      </h3>

                      <div className="grid gap-4 md:grid-cols-2">

                        {/* Title */}

                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Task Title
                          </label>

                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) =>
                              setEditTitle(
                                e.target.value
                              )
                            }
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>

                        {/* Project */}

                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Project
                          </label>

                          <select
                            value={editProjectId}
                            onChange={(e) =>
                              setEditProjectId(
                                e.target.value
                              )
                            }
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          >
                            <option value="">
                              Select Project
                            </option>

                            {projects.map((project) => (
                              <option
                                key={project.id}
                                value={project.id}
                              >
                                {project.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Description */}

                        <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Description
                          </label>

                          <textarea
                            rows="3"
                            value={editDescription}
                            onChange={(e) =>
                              setEditDescription(
                                e.target.value
                              )
                            }
                            placeholder="Enter task description"
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>

                        {/* Status */}

                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Status
                          </label>

                          <select
                            value={editStatus}
                            onChange={(e) =>
                              setEditStatus(
                                e.target.value
                              )
                            }
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                        </div>

                        {/* Priority */}

                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Priority
                          </label>

                          <select
                            value={editPriority}
                            onChange={(e) =>
                              setEditPriority(
                                e.target.value
                              )
                            }
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          >
                            <option value="Low">
                              Low
                            </option>

                            <option value="Medium">
                              Medium
                            </option>

                            <option value="High">
                              High
                            </option>
                          </select>
                        </div>

                        {/* Due Date */}

                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Due Date
                          </label>

                          <input
                            type="date"
                            value={editDueDate}
                            onChange={(e) =>
                              setEditDueDate(
                                e.target.value
                              )
                            }
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>

                      </div>

                      {/* Edit Actions */}

                      <div className="mt-5 flex gap-3">

                        <button
                          type="button"
                          onClick={updateTask}
                          disabled={saving}
                          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {saving
                            ? "Updating..."
                            : "Update Task"}
                        </button>

                        <button
                          type="button"
                          onClick={cancelEditTask}
                          disabled={saving}
                          className="rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-300 disabled:opacity-50"
                        >
                          Cancel
                        </button>

                      </div>

                    </div>

                  ) : (

                    /* Normal Task View */

                    <div className="flex items-center justify-between gap-4">

                      {/* Task Information */}

                      <div>

                        <h3 className="text-base font-semibold text-slate-800">
                          {task.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Project:{" "}
                          {task.projectId?.name ||
                            "Unknown Project"}
                        </p>

                        {task.description && (
                          <p className="mt-1 text-sm text-slate-500">
                            Description:{" "}
                            {task.description}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-slate-400">
                          Priority: {task.priority}
                        </p>

                        {task.dueDate && (
                          <p className="mt-1 text-xs text-slate-400">
                            Due Date:{" "}
                            {new Date(
                              task.dueDate
                            ).toLocaleDateString()}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-slate-400">
                          Task ID: {task.id}
                        </p>

                      </div>

                      {/* Actions */}

                      <div className="flex items-center gap-3">

                        {/* Status */}

                        <select
                          value={task.status}
                          disabled={
                            updatingId === task.id
                          }
                          onChange={(e) =>
                            updateTaskStatus(
                              task,
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 disabled:opacity-50"
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

                        {/* Edit */}

                        <button
                          type="button"
                          onClick={() =>
                            startEditTask(task)
                          }
                          className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                        >
                          Edit
                        </button>

                        {/* Delete */}

                        <button
                          type="button"
                          disabled={
                            deletingId === task.id
                          }
                          onClick={() =>
                            deleteTask(task.id)
                          }
                          className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === task.id
                            ? "Deleting..."
                            : "Delete"}
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
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import ProjectCard from "../components/ProjectCard";
import TaskCard from "../components/TaskCard";

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [taskTitle, setTaskTitle] = useState("");

  const [loading, setLoading] = useState(true);
  const [searchTask, setSearchTask] = useState("");

const [taskStatusFilter, setTaskStatusFilter] = useState("All");
  const [saving, setSaving] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [deletingProjectId, setDeletingProjectId] = useState(null);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const [error, setError] = useState("");

  // Fetch Projects and Tasks
  useEffect(() => {
    async function fetchDashboardData() {
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
        console.error(
          "Fetch Dashboard Data Error:",
          error
        );

        setError(
          error.message || "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Dynamic Statistics
  const totalProjects = projects.length;

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const filteredTasks = tasks.filter((task) => {
  const matchesSearch = task.title
    .toLowerCase()
    .includes(searchTask.toLowerCase());

  const matchesStatus =
    taskStatusFilter === "All" ||
    task.status === taskStatusFilter;

  return matchesSearch && matchesStatus;
});
  // Progress Percentage
  const progressPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
        (completedTasks / totalTasks) * 100
      );

  // Stats
  const stats = [
    {
      title: "Total Projects",
      value: totalProjects,
    },
    {
      title: "Total Tasks",
      value: totalTasks,
    },
    {
      title: "Completed",
      value: completedTasks,
    },
    {
      title: "Pending",
      value: pendingTasks,
    },
  ];
  // Edit Project
  const editProject = (project) => {
    router.push(`/projects/${project.id}`);
  };
  // Delete Project
  const deleteProject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      setDeletingProjectId(id);
      setError("");

      const response = await fetch(
        `/api/projects/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete project"
        );
      }

      setProjects((currentProjects) =>
        currentProjects.filter(
          (project) => project.id !== id
        )
      );

      // Remove tasks belonging to deleted project
      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) =>
            (task.projectId?._id || task.projectId) !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete Project Error:",
        error
      );

      setError(
        error.message || "Failed to delete project"
      );
    } finally {
      setDeletingProjectId(null);
    }
  };

 // Update Task Status

const updateTaskStatus = async (id, newStatus) => {
  const task = tasks.find(
    (currentTask) => currentTask.id === id
  );

  if (!task) return;

  try {
    setUpdatingTaskId(id);
    setError("");

    const response = await fetch(
      `/api/tasks/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId:
            task.projectId?._id || task.projectId,

          title: task.title,

          description:
            task.description || "",

          status: newStatus,

          priority:
            task.priority || "Medium",

          dueDate:
            task.dueDate || null,
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
        currentTask.id === id
          ? updatedTask
          : currentTask
      )
    );

  } catch (error) {
    console.error(
      "Update Task Status Error:",
      error
    );

    setError(
      error.message || "Failed to update task"
    );

  } finally {
    setUpdatingTaskId(null);
  }
};

  // Delete Task
  const deleteTask = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      setDeletingTaskId(id);
      setError("");

      const response = await fetch(
        `/api/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete task"
        );
      }

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete Task Error:",
        error
      );

      setError(
        error.message || "Failed to delete task"
      );
    } finally {
      setDeletingTaskId(null);
    }
  };

  // Add Task
  const addTask = async () => {
    if (taskTitle.trim() === "") {
      setError("Task title is required.");
      return;
    }

    if (projects.length === 0) {
      setError(
        "Please create a project before adding a task."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      // Use first available project
      const selectedProjectId = projects[0].id;

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: selectedProjectId,
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
    } catch (error) {
      console.error(
        "Add Dashboard Task Error:",
        error
      );

      setError(
        error.message || "Failed to create task"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 pl-64">
      <Sidebar />

      <section className="min-h-screen">
        <Header />

        <div className="p-6">

          {/* Error Message */}

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Statistics */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
              />
            ))}
          </div>

          {/* Task Progress */}

          <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Task Progress
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Track your completed tasks
                </p>
              </div>

              <span className="text-2xl font-bold text-slate-800">
                {progressPercentage}%
              </span>
            </div>

            {/* Progress Bar */}

            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-500"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>

            <p className="mt-3 text-sm text-slate-500">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
{/* Task Status Breakdown */}

<div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
  <h2 className="text-lg font-semibold text-gray-900">
    Task Status
  </h2>

  <div className="mt-4 space-y-4">
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">
        Pending
      </span>

      <span className="font-semibold text-gray-900">
        {pendingTasks}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">
        In Progress
      </span>

      <span className="font-semibold text-gray-900">
        {inProgressTasks}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">
        Completed
      </span>

      <span className="font-semibold text-gray-900">
        {completedTasks}
      </span>
    </div>
  </div>
</div>
          {/* Projects */}

          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Recent Projects
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Overview of your latest projects
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                (window.location.href =
                  "/projects")
                }
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View All
              </button>
            </div>

            {loading ? (
              <div className="rounded-xl border bg-white p-8 text-center">
                <p className="text-sm text-slate-500">
                  Loading projects...
                </p>
              </div>
            ) : projects.length === 0 ? (
              <div className="rounded-xl border bg-white p-8 text-center">
                <p className="text-sm text-slate-500">
                  No projects found.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={editProject}
                    onDelete={deleteProject}
                    deleting={deletingProjectId === project.id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Tasks */}

          <div className="mt-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Recent Tasks
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your project tasks
              </p>
            </div>
{/* Search and Filter */}
<div className="mb-5 flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:flex-row">
  <input
    type="text"
    placeholder="Search tasks..."
    value={searchTask}
    onChange={(e) => setSearchTask(e.target.value)}
    className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  />

  <select
    value={taskStatusFilter}
    onChange={(e) => setTaskStatusFilter(e.target.value)}
    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  >
    <option value="All">All Status</option>
    <option value="Pending">Pending</option>
    <option value="In Progress">In Progress</option>
    <option value="Completed">Completed</option>
  </select>
</div>
            {/* Add Task */}

            <div className="mb-5 flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:flex-row">
              <input
                type="text"
                placeholder="Enter a new task..."
                value={taskTitle}
                onChange={(e) =>
                  setTaskTitle(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTask();
                  }
                }}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={addTask}
                disabled={
                  saving ||
                  loading ||
                  projects.length === 0
                }
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Adding..." : "Add Task"}
              </button>
            </div>

            {/* Task List */}
{loading ? (
  <div className="rounded-xl border bg-white p-8 text-center">
    <p className="text-sm text-slate-500">
      Loading tasks...
    </p>
  </div>
) : tasks.length === 0 ? (
  <div className="rounded-xl border bg-white p-8 text-center">
    <p className="text-sm text-slate-500">
      No tasks found.
    </p>
  </div>
) : filteredTasks.length === 0 ? (
  <div className="rounded-xl border bg-white p-8 text-center">
    <p className="text-sm text-slate-500">
      No tasks match your search or filter.
    </p>

    <button
      type="button"
      onClick={() => {
        setSearchTask("");
        setTaskStatusFilter("All");
      }}
      className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      Clear Filters
    </button>
  </div>
) : (
  <div className="space-y-3">
    {filteredTasks.map((task) => (
      <div
        key={task.id}
        className={
          updatingTaskId === task.id
            ? "opacity-60"
            : ""
        }
      >
        <TaskCard
          task={task}
          onDelete={deleteTask}
          onStatusChange={updateTaskStatus}
          deleting={deletingTaskId === task.id}
        />
      </div>
    ))}
  </div>
)}
          </div>

        </div>
      </section>
    </main>
  );
}
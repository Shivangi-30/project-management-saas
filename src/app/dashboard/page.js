"use client";

import { useState } from "react";

import { useAppContext } from "../../context/AppContext";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import ProjectCard from "../components/ProjectCard";
import TaskCard from "../components/TaskCard";

export default function Dashboard() {
const { projects, tasks, setTasks, setProjects } = useAppContext();

const deleteProject = (id) => {
  setProjects(
    projects.filter((project) => project.id !== id)
  );
};

  const [taskTitle, setTaskTitle] = useState("");

  // Dynamic Statistics

  const totalProjects = projects.length;

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  // Progress Percentage

  const progressPercentage =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

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

  const toggleTaskStatus = (id) => {
  setTasks(
    tasks.map((task) =>
      task.id === id
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
  // Delete Task

  const deleteTask = (id) => {
    setTasks(
      tasks.filter((task) => task.id !== id)
    );
  };

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

  return (
    <main className="min-h-screen bg-slate-100 pl-64">
      <Sidebar />

      <section className="min-h-screen">
        <Header />

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
    ></div>
  </div>

  <p className="mt-3 text-sm text-slate-500">
    {completedTasks} of {totalTasks} tasks completed
  </p>

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

    <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
      View All
    </button>
  </div>

  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
    {projects.map((project) => (
  <ProjectCard
    key={project.id}
    project={project}
    onDelete={deleteProject}
  />
))}
  </div>

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

  {/* Add Task */}

  <div className="mb-5 flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:flex-row">
    
    <input
      type="text"
      placeholder="Enter a new task..."
      value={taskTitle}
      onChange={(e) => setTaskTitle(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          addTask();
        }
      }}
      className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />

    <button
      onClick={addTask}
      className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
    >
      Add Task
    </button>

  </div>

  {/* Task List */}

  <div className="space-y-3">
    {tasks.map((task) => (
     <TaskCard
  key={task.id}
  task={task}
  onDelete={deleteTask}
  onToggleStatus={toggleTaskStatus}
/>
    ))}
  </div>

</div>
      </section>
    </main>
  );
}
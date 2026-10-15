"use client";

import { useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import ProjectCard from "../../components/ProjectCard";

export default function ProjectsPage() {
  const { projects, setProjects } = useAppContext();

  const [projectName, setProjectName] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Add Project
  const addProject = () => {
    if (projectName.trim() === "") return;

    const newProject = {
      id: Date.now(),
      name: projectName.trim(),
      description: "New project",
      status: "Pending",
    };

    setProjects([...projects, newProject]);
    setProjectName("");
  };

  // Delete Project
  const deleteProject = (id) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  // Edit Project
  const editProject = (project) => {
    setEditingId(project.id);
    setProjectName(project.name);
  };

  // Update Project
  const updateProject = () => {
    if (projectName.trim() === "") return;

    setProjects(
      projects.map((project) =>
        project.id === editingId
          ? { ...project, name: projectName.trim() }
          : project
      )
    );

    setProjectName("");
    setEditingId(null);
  };

  // Update Project Status
  const updateProjectStatus = (id, newStatus) => {
    setProjects(
      projects.map((project) =>
        project.id === id
          ? { ...project, status: newStatus }
          : project
      )
    );
  };

  return (
    <main className="mx-auto w-full max-w-7xl min-w-0 p-3 sm:p-6">
      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Projects
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create, organize, and manage your projects.
        </p>
      </div>

      {/* Add / Edit Project */}
      <form
        className="mb-6 flex min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5"
        onSubmit={(e) => {
          e.preventDefault();
          editingId === null ? addProject() : updateProject();
        }}
      >
        <input
          type="text"
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          aria-label="Project name"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="submit"
          disabled={!projectName.trim()}
          className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {editingId === null ? "Add Project" : "Update Project"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setProjectName("");
            }}
            className="w-full rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Project count */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-800">
          All Projects
        </h2>
        <span className="text-sm text-slate-500">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </span>
      </div>

      {/* Project cards */}
      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
          <h3 className="text-lg font-semibold text-slate-800">
            No projects yet
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Create your first project using the form above.
          </p>
        </div>
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-5">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={deleteProject}
              onEdit={editProject}
              onStatusChange={updateProjectStatus}
            />
          ))}
        </div>
      )}
    </main>
  );
}

"use client";

import { useState } from "react";

import { useAppContext } from "../../context/AppContext";

import Sidebar from "../components/Sidebar";

import Header from "../components/Header";

import ProjectCard from "../components/ProjectCard";

export default function ProjectsPage() {
  const { projects, setProjects } = useAppContext();

  const [projectName, setProjectName] = useState("");

  const [projectDescription, setProjectDescription] = useState("");

  const [editingProjectId, setEditingProjectId] = useState(null);

  // Delete Project
  const deleteProject = (id) => {
    setProjects(
      projects.filter((project) => project.id !== id)
    );
  };

  // Edit Project
  const editProject = (project) => {
    setEditingProjectId(project.id);

    setProjectName(project.name);

    setProjectDescription(project.description);
  };

  // Update Project
  const updateProject = () => {
    if (projectName.trim() === "") return;

    setProjects(
      projects.map((project) =>
        project.id === editingProjectId
          ? {
              ...project,
              name: projectName,
              description:
                projectDescription || "No description added.",
            }
          : project
      )
    );

    setEditingProjectId(null);

    setProjectName("");

    setProjectDescription("");
  };

  // Add Project
  const addProject = () => {
    if (projectName.trim() === "") return;

    const newProject = {
      id: Date.now(),

      name: projectName,

      description:
        projectDescription || "No description added.",

      status: "Active",
    };

    setProjects([...projects, newProject]);

    setProjectName("");

    setProjectDescription("");
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
              Projects
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage and track all your projects.
            </p>
          </div>

          {/* Add / Edit Project Form */}
          <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">

            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              {editingProjectId
                ? "Edit Project"
                : "Add New Project"}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">

              {/* Project Name */}
              <input
                type="text"
                placeholder="Project name"
                value={projectName}
                onChange={(e) =>
                  setProjectName(e.target.value)
                }
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
              />

              {/* Project Description */}
              <input
                type="text"
                placeholder="Project description"
                value={projectDescription}
                onChange={(e) =>
                  setProjectDescription(e.target.value)
                }
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
              />

            </div>

            {/* Add / Update Button */}
            <button
              onClick={
                editingProjectId
                  ? updateProject
                  : addProject
              }
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white"
            >
              {editingProjectId
                ? "Update Project"
                : "Add Project"}
            </button>

            {/* Cancel Edit Button */}
            {editingProjectId && (
              <button
                onClick={() => {
                  setEditingProjectId(null);
                  setProjectName("");
                  setProjectDescription("");
                }}
                className="ml-3 rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Projects List */}
          {projects.length === 0 ? (

            <div className="rounded-xl border bg-white p-10 text-center">

              <h2 className="text-lg font-semibold text-slate-800">
                No Projects Found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Add your first project above.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

              {projects.map((project) => (

                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={deleteProject}
                  onEdit={editProject}
                />

              ))}

            </div>

          )}

        </div>
      </section>
    </main>
  );
}


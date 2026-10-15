"use client";

import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ProjectCard from "../components/ProjectCard";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [editingProjectId, setEditingProjectId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [error, setError] = useState("");

  // Fetch Projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/projects");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch projects");
        }

        const formattedProjects = data.projects.map((project) => ({
          ...project,
          id: project._id,
        }));

        setProjects(formattedProjects);
      } catch (error) {
        console.error("Fetch Projects Error:", error);
        setError(error.message || "Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Delete Project
  const deleteProject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete project");
      }

      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== id)
      );
    } catch (error) {
      console.error("Delete Project Error:", error);
      setError(error.message || "Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  // Edit Project
  const editProject = (project) => {
    setEditingProjectId(project.id);

    setProjectName(project.name);

    setProjectDescription(project.description || "");
  };

  // Update Project
  const updateProject = async () => {
    if (projectName.trim() === "") {
      setError("Project name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/api/projects/${editingProjectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: projectName,
            description: projectDescription,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update project");
      }

      const updatedProject = {
        ...data.project,
        id: data.project._id,
      };

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === editingProjectId
            ? updatedProject
            : project
        )
      );

      setEditingProjectId(null);
      setProjectName("");
      setProjectDescription("");
    } catch (error) {
      console.error("Update Project Error:", error);
      setError(error.message || "Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  // Add Project
  const addProject = async () => {
    if (projectName.trim() === "") {
      setError("Project name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
          description: projectDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create project");
      }

      const newProject = {
        ...data.project,
        id: data.project._id,
      };

      setProjects((currentProjects) => [
        newProject,
        ...currentProjects,
      ]);

      setProjectName("");
      setProjectDescription("");
    } catch (error) {
      console.error("Add Project Error:", error);
      setError(error.message || "Failed to create project");
    } finally {
      setSaving(false);
    }
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditingProjectId(null);
    setProjectName("");
    setProjectDescription("");
    setError("");
  };

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
              Projects
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage and track all your projects.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Add / Edit Project Form */}
          <div className="mb-6 min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              {editingProjectId
                ? "Edit Project"
                : "Add New Project"}
            </h2>

            <div className="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">

              {/* Project Name */}
              <input
                type="text"
                placeholder="Project name"
                value={projectName}
                onChange={(e) =>
                  setProjectName(e.target.value)
                }
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              />

              {/* Project Description */}
              <input
                type="text"
                placeholder="Project description"
                value={projectDescription}
                onChange={(e) =>
                  setProjectDescription(e.target.value)
                }
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>

            {/* Add / Update Button */}
            <button
              type="button"
              onClick={
                editingProjectId
                  ? updateProject
                  : addProject
              }
              disabled={saving}
              className="mt-3 w-full rounded-lg bg-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-300 disabled:opacity-50 sm:ml-3 sm:mt-0 sm:w-auto">
              {saving
                ? "Saving..."
                : editingProjectId
                ? "Update Project"
                : "Add Project"}
            </button>

            {/* Cancel Edit Button */}
            {editingProjectId && (
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="ml-3 rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-300 disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="rounded-xl border bg-white p-10 text-center">
              <p className="text-sm text-slate-500">
                Loading projects...
              </p>
            </div>
          ) : projects.length === 0 ? (

            /* No Projects */
            <div className="rounded-xl border bg-white p-10 text-center">

              <h2 className="text-lg font-semibold text-slate-800">
                No Projects Found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Add your first project above.
              </p>

            </div>
          ) : (

            /* Projects List */
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-5">

              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={deleteProject}
                  onEdit={editProject}
                  deleting={deletingId === project.id}
                />
              ))}

            </div>
          )}

        </div>
      </section>
    </main>
  );
}
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
      name: projectName,
      description: "New project",
      status: "Pending",
    };

    setProjects([...projects, newProject]);
    setProjectName("");
  };

  // Delete Project
  const deleteProject = (id) => {
    setProjects(
      projects.filter((project) => project.id !== id)
    );
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
          ? {
              ...project,
              name: projectName,
            }
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
          ? {
              ...project,
              status: newStatus,
            }
          : project
      )
    );
  };

  return (
    <main>
      <h1>Projects</h1>

      <input
        type="text"
        placeholder="Enter project name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />

      {editingId === null ? (
        <button onClick={addProject}>
          Add Project
        </button>
      ) : (
        <button onClick={updateProject}>
          Update Project
        </button>
      )}

      <div>
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
    </main>
  );
}
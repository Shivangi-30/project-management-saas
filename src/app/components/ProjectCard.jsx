"use client";

import Link from "next/link";

export default function ProjectCard({
  project,
  onDelete,
  onEdit,
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            {project.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {project.description}
          </p>
        </div>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          {project.status}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <span className="text-sm text-slate-500">
          {project.tasks?.length || 0} Tasks
        </span>

        <div className="flex items-center gap-3">
          <Link
            href={`/projects/${project.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View Project
          </Link>

          <button
            onClick={() => onEdit(project)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(project.id)}
            className="text-sm font-medium text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Project Management SaaS",
      description: "A project management dashboard",
      status: "Active",
    },
    {
      id: 2,
      name: "Chiku Cab Website",
      description: "Taxi booking website",
      status: "Active",
    },
    {
      id: 3,
      name: "Portfolio Website",
      description: "Personal developer portfolio",
      status: "Active",
    },
  ]);

const [tasks, setTasks] = useState([
  {
    id: 1,
    title: "Create homepage",
    status: "Completed",
    projectId: 1,
  },
  {
    id: 2,
    title: "Build dashboard",
    status: "In Progress",
    projectId: 1,
  },
  {
    id: 3,
    title: "Add login page",
    status: "Pending",
    projectId: 2,
  },
]);

  return (
    <AppContext.Provider
      value={{
        projects,
        setProjects,
        tasks,
        setTasks,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
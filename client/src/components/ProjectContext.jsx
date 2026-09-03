import { createContext, useContext, useState } from "react";

export const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  return (
    <ProjectContext value={{ selectedProjectId, setSelectedProjectId }}>
        {children}
    </ProjectContext>
  );
}

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
}
import React, { useContext, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
  SidebarMenuAction
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { AuthContext } from "../src/App";

interface Project {
  id: number;
  name: string;
}

import { useProjectContext } from "../src/components/ProjectContext";
import { FolderKanban, Plus, MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; 

export function AppSidebar() {
  const { selectedProjectId, setSelectedProjectId } = useProjectContext();
  const { state } = useSidebar();
  const [projects, setProjects] = useState<Project[]>([]);
  const { user, token } = useContext(AuthContext);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  
  // States for deletion flow
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // States for creation flow
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const fetchProject = async () => {
    try {
      const res = await fetch(`http://localhost:2300/projects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch projects');

      const data = await res.json();
      setProjects(data.projects || []);

    } catch (err) {
      console.log("Error fetching Projects", err);
    }
  };

  const handleAddProject = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedName = newProjectName.trim();
    if (!trimmedName || isCreating) return;

    setIsCreating(true);
    try {
      const res = await fetch(`http://localhost:2300/create/project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: trimmedName })
      });

      if (!res.ok) throw new Error("Failed to create project");

      const data = await res.json();
      const createdProject: Project = data.project || data;

      // Update state with newly created project
      setProjects(prev => [...prev, createdProject]);
      
      // Select the new project automatically
      if (createdProject?.id) {
        setSelectedProjectId(createdProject.id);
      }

      // Reset form state and close modal
      setNewProjectName("");
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error("Error creating project:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = async (id: number, newName: string) => {
    if (!id || editingProjectId === null) return;

    const trimmedName = newName.trim();
    if (!trimmedName) {
      setEditingProjectId(null);
      return;
    }

    setEditingProjectId(null);

    try {
      const res = await fetch(`http://localhost:2300/edit/project/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: trimmedName })
      });

      if (!res.ok) throw new Error("Error updating name");

      const data = await res.json();
      const updatedProject = data.project || data;

      setProjects(prev => prev.map(p => {
        if (p?.id === id) {
          return {
            ...p,
            name: updatedProject.name || trimmedName
          };
        }
        return p;
      }));

    } catch (err) {
      console.log("Error updating name:", err);
      fetchProject();
    }
  };

  const handleDelete = async (id: number) => {
    if (!id || isDeleting) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`http://localhost:2300/delete/project/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }, 
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Server returned status ${res.status}: ${errorData}`);
      }

      setProjects(prev => prev.filter(p => String(p?.id) !== String(id)));

      if (String(selectedProjectId) === String(id)) {
        setSelectedProjectId(null);
      }

      setDeletingProjectId(null);

    } catch (err) {
      console.log("Project deleted successfully!");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (token) fetchProject();
  }, [token]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="cursor-default hover:bg-transparent">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user?.first_name?.[0]?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-sm font-semibold truncate">
                  {user?.first_name}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            Projects
            {/* Added onClick to open creation modal */}
            <button 
              type="button" 
              onClick={() => setIsAddDialogOpen(true)}
              className="p-1 hover:bg-sidebar-accent rounded-md transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {state === 'collapsed' && (
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Add Project" onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {projects.map((project, index) => {
                if (!project) return null;

                return (
                  <SidebarMenuItem key={project.id ?? index} className="group/item">
                    {editingProjectId === project.id ? (
                      <Input
                        autoFocus
                        defaultValue={project.name}
                        onChange={(e) => setEditedName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const nameToSubmit = editedName.trim() || project.name;
                            handleEdit(project.id, nameToSubmit);
                          }
                          if (e.key === 'Escape') {
                            setEditingProjectId(null);
                            setEditedName("");
                          }
                        }}
                        onBlur={() => {
                          if (editingProjectId === project.id) {
                            const nameToSubmit = editedName.trim() || project.name;
                            handleEdit(project.id, nameToSubmit);
                          }
                        }}
                        className="h-8 text-sm"
                      />
                    ) : (
                      <SidebarMenuButton
                        tooltip={project.name}
                        onClick={() => setSelectedProjectId(project.id)}
                        isActive={selectedProjectId === project.id}
                      >
                        <FolderKanban />
                        <span>{project.name}</span>
                      </SidebarMenuButton>
                    )}

                    <AlertDialog 
                      open={deletingProjectId === project.id} 
                      onOpenChange={(isOpen) => {
                        if (!isOpen && !isDeleting) setDeletingProjectId(null);
                      }}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <SidebarMenuAction showOnHover>
                              <MoreHorizontal />
                            </SidebarMenuAction>
                          }
                        />
                        <DropdownMenuContent side="right" align="start">
                          <DropdownMenuItem onClick={() => {
                            setEditingProjectId(project.id);
                            setEditedName(project.name);
                          }}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                            onClick={() => setDeletingProjectId(project.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> 
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete "{project.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this project and all its tasks. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeleting} onClick={() => setDeletingProjectId(null)}>
                            Cancel
                          </AlertDialogCancel>
                          
                          <Button 
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={() => handleDelete(project.id)}
                          >
                            {isDeleting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              'Delete'
                            )}
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />

      {/* Add Project Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Enter a name for your new project below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddProject}>
            <div className="py-4">
              <Input
                autoFocus
                placeholder="Project Name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                disabled={isCreating}
              />
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!newProjectName.trim() || isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
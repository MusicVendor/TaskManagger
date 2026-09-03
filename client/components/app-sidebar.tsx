import React, { useContext, useState, useEffect } from 'react';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthContext } from "../src/App";
interface Project {
  id: number;
  name: string;
}
import {useProjectContext} from "../src/components/ProjectContext";
import { FolderKanban, Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; 

export function AppSidebar() {
    const { selectedProjectId, setSelectedProjectId } = useProjectContext();
    const {state} = useSidebar();
    const [projects, setProjects] = useState<Project[]>([]);
    const { user, token } = useContext(AuthContext);

    const fetchProject = async () => {
      try{
        const res = await fetch(`http://localhost:2300/projects`,{
          method : 'GET',
          headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if(!res.ok){
          throw new Error('Failed to fetch projects');
        }

        const data = await res.json();
        setProjects(data.projects);

      } catch(err){
        console.log("Error fetching Projects", err);
      }
    }

    const handleEdit = async(id: number, newName: string) => {
        try{
            const res = await fetch(`http://localhost:2300/edit/project/${id}`, {
                method : 'PATCH',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${(token)}`
                },
                body : JSON.stringify({name : newName})
            })

            if(!res.ok) throw new Error("Error updating name");

            const data =  await res.json();
        } catch(err){
            console.log("Error updating name:", err);
        }
    }

    const handleDelete = async(id: number) => {
        console.log('Delete clicked with id:', id);
    }

  useEffect (() =>{
    if(token)
    fetchProject();
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
                        <button>
                            <Plus className="h-4 w-4"/>
                        </button>
                    </SidebarGroupLabel>
                    {}
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {state === 'collapsed' && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton tooltip="Add Project">
                                        <Plus className="h-4 w-4" />
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                            {projects.map((project) => (
                                <SidebarMenuItem key={project.id} className="group/item">
                                    <SidebarMenuButton
                                        tooltip={project.name}
                                        onClick={() => setSelectedProjectId(project.id)}
                                        isActive={selectedProjectId === project.id}
                                    >
                                        <FolderKanban />
                                        <span>{project.name}</span>
                                    </SidebarMenuButton>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger render ={
                                            <SidebarMenuAction showOnHover>
                                                <MoreHorizontal />
                                            </SidebarMenuAction>
                                        }/>
                                        <DropdownMenuContent side="right" align="start">
                                            <DropdownMenuItem onClick={() => handleEdit(project.id)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(project.id)}
                                                className="text-destructive focus:text-destructive"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter />
        </Sidebar>
    );
}
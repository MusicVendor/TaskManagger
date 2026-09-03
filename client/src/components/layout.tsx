import React from "react";
import {createContext, useState, ReactNode} from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {ProjectProvider} from './ProjectContext';

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <ProjectProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </ProjectProvider>
  )
}
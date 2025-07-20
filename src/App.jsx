import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'
import NavBar from './components/NavBar.jsx'
import MainContent from './components/MainContent.jsx';

function App() {
 const userName = "Josh";
const categories = [
  {
    type: "Private",
    projects: [
      {
        name: "Task Manager",
        tasks: {
          todo: [
            {
              title: "Setup Backend API",
              tag: "Coding",
              description: "Create Express.js API for tasks.",
              deadline: "12th July, 2025"
            },
            {
              title: "Database Schema Design",
              tag: "Research",
              description: "Design the MongoDB schema for user and task collections.",
              deadline: "14th July, 2025"
            }
          ],
          inprogress: [
            {
              title: "Design Dashboard UI",
              tag: "Design",
              description: "Implement Figma design in React.",
              deadline: "15th July, 2025"
            },
            {
              title: "Setup Authentication",
              tag: "Coding",
              description: "Integrate JWT-based login system.",
              deadline: "16th July, 2025"
            }
          ],
          completed: [
            {
              title: "Setup Project Structure",
              tag: "Setup",
              description: "Setup project structure using Vite + React + Express.",
              deadline: "10th July, 2025"
            }
          ]
        }
      },
      {
        name: "Portfolio Website",
        tasks: {
          todo: [
            {
              title: "Add Contact Form",
              tag: "Coding",
              description: "Add a contact form with emailJS integration.",
              deadline: "18th July, 2025"
            }
          ],
          inprogress: [
            {
              title: "Projects Showcase Section",
              tag: "Design",
              description: "Design the layout for projects showcase section.",
              deadline: "17th July, 2025"
            }
          ],
          completed: [
            {
              title: "Setup Portfolio Boilerplate",
              tag: "Setup",
              description: "Initialized portfolio with React and Vite setup.",
              deadline: "9th July, 2025"
            }
          ]
        }
      }
    ]
  },
  {
    type: "Shared",
    projects: [
      {
        name: "Team Board",
        tasks: {
          todo: [
            {
              title: "Create Task Assignment Feature",
              tag: "Coding",
              description: "Allow team leads to assign tasks to members.",
              deadline: "19th July, 2025"
            }
          ],
          inprogress: [
            {
              title: "Live Chat Integration",
              tag: "Coding",
              description: "Integrate socket.io for live team communication.",
              deadline: "20th July, 2025"
            }
          ],
          completed: [
            {
              title: "Setup Team Board UI",
              tag: "Design",
              description: "Basic UI setup with dashboard and sidebar.",
              deadline: "12th July, 2025"
            }
          ]
        }
      },
      {
        name: "CRM System",
        tasks: {
          todo: [
            {
              title: "Leads Dashboard",
              tag: "Design",
              description: "Create design layout for leads dashboard.",
              deadline: "22nd July, 2025"
            }
          ],
          inprogress: [],
          completed: [
            {
              title: "Setup CRM Boilerplate",
              tag: "Setup",
              description: "Setup CRM project with React + Express backend.",
              deadline: "11th July, 2025"
            }
          ]
        }
      }
    ]
  }
];

  return (
    <BrowserRouter>
      <div className='App'>
        <NavBar 
        userName={userName}
        category={categories}
        />
        <Routes>
          {categories.map((category)=>(
            category.projects.map((project, index)=>(
              <Route 
              key={index} 
              path={`/${project.name.replace(/\s+/g, '-').toLowerCase()}`}
              element={<MainContent title={project.name} task={project.tasks}/>}/>
            ))
          ))}   
        </Routes>
      </ div>
    </BrowserRouter>
  )
}

export default App

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
    projects: ["Task Manager", "Portfolio Website"]
  },
  {
    type: "Shared",
    projects: ["Team Board", "CRM System"]
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
            category.projects.map((project, index) => (
              <Route 
            key={index} 
            path={`/${project.replace(/\s+/g, '-').toLowerCase()}`} 
            element={<MainContent title={project}/>} />
          ))))}        
        </Routes>
      </ div>
    </BrowserRouter>
  )
}

export default App

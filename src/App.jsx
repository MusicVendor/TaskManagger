import { useState } from 'react'
import './App.css'
import NavBar from './components/NavBar.jsx'

function App() {
  const userName = "Josh";
  const categories = [
  {
    type: "Private",
    projects: ["TaskManager", "Portfolio Website"]
  },
  {
    type: "Shared",
    projects: ["Team Board", "CRM System"]
  }
];


  return (
    <div className='App'>
      <NavBar 
      userName={userName}
      category={categories}
      />
    </ div>
  )
}

export default App

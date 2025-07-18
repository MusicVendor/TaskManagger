import { useState } from 'react'
import './App.css'
import NavBar from './components/NavBar.jsx'
import Main from './components/Main.jsx'

function App() {

  return (
    <div className='App'>
      <NavBar 
      userName="Josh"
      privateName="Task Manager"
      sharedName="Smart India Hackathon"
      />
      <Main name="Task Manager"/>
    </ div>
  )
}

export default App

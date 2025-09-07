import React from 'react'
import { NavLink } from 'react-router-dom'
import profilePic from '../assets/profile-pic.png'
import logoUpdate from '../assets/logo-updates.png'
import logoSetting from '../assets/logo-setting.png'
import logoSearch from '../assets/logo-search.png'
import logoAdd from '../assets/logo-add.png'
import './NavBar.css'

function NavBar({ projects }) {
  return (
    <div className='left-navBar'>
      {/* Profile Section */}
      <div className='profile'>
        <img src={profilePic} className='profile-pic' alt='User Profile Pic' />
        <p className='profile-greeting'>
          Welcome! <span className='profile-user'>Jon</span>
        </p>
      </div>

      {/* Options */}
      <ul className='options'>
        <li className='options-search'><img src={logoSearch} className='logo' alt="" />Search</li>
        <li className='options-updates'><img src={logoUpdate} className='logo' alt="" />Updates</li>
        <li className='options-setting'><img src={logoSetting} className='logo' alt="" />Settings</li>
      </ul>

      {/* Projects */}
      <div className='projects'>
        <div className="projects-header">
          <h2 className='projects-head'>Projects</h2>
          <img src={logoAdd} className='projects-addLogo' style={{ height: '14.6px', width: '14.6px' }} alt="Add" />
        </div>

        <ul className='projects-list'>
          {projects.map((proj) => (
            <li key={proj._id} className='projects-title'>
              <NavLink
                to={`/${proj.title.replace(/\s+/g, '-').toLowerCase()}`}
                className={({ isActive }) => isActive ? "active-link" : "link"}
              >
                {proj.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default NavBar
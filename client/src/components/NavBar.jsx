import React, { useState } from 'react';
import profilePic from '../assets/profile-pic.png';
import logoUpdate from '../assets/logo-updates.png';
import logoSetting from '../assets/logo-setting.png';
import logoSearch from '../assets/logo-search.png';
import logoAdd from '../assets/logo-add.png';
import './NavBar.css';

function NavBar({ projects = [], onProjectSelect, onProjectAdded, token }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProjectClick = (projectId) => {
    if (onProjectSelect) onProjectSelect(projectId);
  };

  const handleAddProject = async () => {
    const title = newProjectName.trim();
    if (!title) return alert('Please enter a project name.');

    setLoading(true);
    try {
      const res = await fetch('http://localhost:2300/Home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ title, members: [] }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => null);
        throw new Error(errText || 'Failed to create project');
      }

      const created = await res.json();

      // Clear UI and notify parent to refresh projects
      setNewProjectName('');
      setIsAdding(false);

      if (onProjectAdded) {
        // call without args (parent will refetch) OR pass created project
        onProjectAdded(created);
      }
    } catch (err) {
      console.error('Error adding project:', err);
      alert(err.message || 'Could not add project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="left-navBar">
      {/* Profile Section */}
      <div className="profile">
        <img src={profilePic} className="profile-pic" alt="User Profile Pic" />
        <p className="profile-greeting">
          Welcome! <span className="profile-user">Jon</span>
        </p>
      </div>

      {/* Options */}
      <ul className="options">
        <li className="options-search">
          <img src={logoSearch} className="logo" alt="Search" />Search
        </li>
        <li className="options-updates">
          <img src={logoUpdate} className="logo" alt="Updates" />Updates
        </li>
        <li className="options-setting">
          <img src={logoSetting} className="logo" alt="Settings" />Settings
        </li>
      </ul>

      {/* Projects */}
      <div className="projects">
        <div className="projects-header">
          <h2 className="projects-head">Projects</h2>
          <img
            src={logoAdd}
            className="projects-addLogo"
            style={{ height: '14.6px', width: '14.6px', cursor: 'pointer' }}
            alt="Add Project"
            onClick={() => setIsAdding((s) => !s)}
          />
        </div>

        {/* Add Project Inline Form */}
        {isAdding && (
          <div className="add-project-form" style={{ marginTop: 10 }}>
            <input
              className="add-project-input"
              type="text"
              placeholder="New project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              disabled={loading}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                className="add-project-btn"
                onClick={handleAddProject}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
              <button
                className="add-project-btn"
                style={{ backgroundColor: '#ddd', color: '#222' }}
                onClick={() => {
                  setIsAdding(false);
                  setNewProjectName('');
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <ul className="projects-list">
          {projects.length > 0 ? (
            projects.map((proj) => (
              <li
                key={proj._id}
                className="projects-title"
                onClick={() => handleProjectClick(proj._id)}
                style={{ cursor: 'pointer' }}
              >
                {proj.title}
              </li>
            ))
          ) : (
            <li className="projects-empty">No Projects Available</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default NavBar;

import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Login from "./components/Login.jsx";
import NavBar from "./components/NavBar.jsx";
import MainContent from "./components/MainContent.jsx";

function App() {
  const [projects, setProjects] = useState([]);
  const [token, setToken] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // ✅ Login handler
  const handleLogin = async ({ user, pwd }) => {
    try {
      const res = await fetch("http://localhost:2300/auth", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ user, pwd }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login Failed");

      setToken(data.accessToken);
    } catch (err) {
      console.log(err.message);
      alert(err.message);
    }
  };

  // ✅ Fetch projects (reusable function)
  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:2300/Home", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch projects");

      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects", err);
    }
  };

  // ✅ Fetch projects when token changes (after login)
  useEffect(() => {
    if (token) fetchProjects();
  }, [token]);

  return (
    <BrowserRouter>
      <div className="App">
        {!token ? (
          <Login onLogin={handleLogin} />
        ) : (
          <>
            <NavBar
              projects={projects}
              onProjectSelect={setSelectedProjectId}
              onProjectAdded={fetchProjects} // ✅ Added this for reloading after new project
              token={token} // ✅ Optional but useful for POST requests from NavBar
            />
            <MainContent
              selectedProjectId={selectedProjectId}
              token={token}
            />
          </>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;

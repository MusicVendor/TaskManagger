import { useState, useEffect, createContext } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { TooltipProvider } from "@/components/ui/tooltip";
export const AuthContext = createContext();


function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const clientId = import.meta.env.VITE_CLIENT_ID;

  // ✅ Login handler
  const handleLogin = (newToken, newUser)=>{
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('accessToken', newToken);
  }

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

  return (
    <TooltipProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <AuthContext value = {{token, user}}>
          <BrowserRouter>
            <div className="App">
              {!token ? (
                <Login onClick={handleLogin} />
              ) : (
                  <Dashboard />
              )}
            </div>
          </BrowserRouter>
        </AuthContext>
      </GoogleOAuthProvider>
    </TooltipProvider>
  );
}

export default App;
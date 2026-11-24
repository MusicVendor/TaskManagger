import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthContext } from "./AuthContext";


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
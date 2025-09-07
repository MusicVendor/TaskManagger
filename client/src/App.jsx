import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login.jsx";
import NavBar from "./components/NavBar.jsx";
import MainContent from "./components/MainContent.jsx";

function App() {
  const [project, setProject] = useState(null);
  const [token, setToken] = useState(null); // user is null until login

  const handleLogin = async ({user, pwd}) => {
    try {
      const res = await fetch("http://localhost:2300/auth", {
        method:"POST",
        headers: {"Content-type":"application/json"},
        body: JSON.stringify({user, pwd})
      });
      console.log(JSON.stringify({user, pwd}));
      const data = await res.json();

      if(!res.ok) throw new Error(data.message || "Login Failed");

      setToken(data.accessToken);
    }
    catch (err){
      console.log(err.message);
      alert(err.message);
    }
  }

  // Fetch data only after login
  useEffect(() => {
    const fetchProject = async () =>  {
      try {
        console.log(token);
        const res = await fetch("http://localhost:2300/Home", {
          method: "GET", 
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if(!res.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await res.json();
        setProject(data);
      }
      catch (err) {
        console.error("Error fetching project", err);
      }
    }

    if(token) fetchProject();
  }, [token]);

  return (
    <BrowserRouter>
      <div className="App">
        {!token ? (
          // When not logged in
          <Login onLogin={handleLogin} />
        ) : (
          <>
            {/* Show navbar after login & data fetch */}
            {project && (
              <NavBar
                projects = {project}
              />
            )}
          </>
          )}
      </div>
    </BrowserRouter>
  );
}

export default App;




{/*<Routes>
              {navbarData ? (
                navbarData.categories.map((category) =>
                  category.projects.map((project, index) => (
                    <Route
                      key={index}
                      path={`/${project.name.replace(/\s+/g, "-").toLowerCase()}`}
                      element={
                        <MainContent
                          title={project.name}
                          task={project.tasks}
                        />
                      }
                    />
                  ))
                )
              ) : (
                <Route path="*" element={<p>Loading...</p>} />
              )}
            </Routes>
          </>
        )}
      </div>*/}
import React, { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // For now just mock login success
    console.log("Password:", pwd);

    // Tell App.jsx that user has logged in
    onLogin({ user, pwd });
  };

  return (
    <div className="background">
      <div className="form">
        <h1 className="form-head">Welcome Back</h1>
        <p>Please enter the details</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {/*User Name */}
          <div className="login-form-element">
            <label>Username: </label>
            <input
              className="element-input"
              type="userName"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Enter your userName"
              required
            />
          </div>

          {/* Password */}
          <div className="login-form-element">
            <label>Password: </label>
            <input
              className="element-input"
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Button */}
          <div className="login-form-element">
            <button className="element-button" type="submit">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
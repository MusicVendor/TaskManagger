import React from "react";
import { GoogleLogin } from '@react-oauth/google';
import { API_URL } from "../api";
import { useState } from "react";
import { Check, Layers3, UsersRound } from "lucide-react";
import "./Login.css";

function Login({onClick }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async (credentialResponse) => {
    const googleToken = credentialResponse.credential;
    setIsConnecting(true);
    setErrorMessage("");
    
    try{
      const res = await fetch(`${API_URL}/login/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken }),
      });

      if(!res.ok){
        throw new Error('Google login failed');
      }
      
      const data = await res.json();
      onClick(data.accessToken, data.user);
    } 
    catch (err){
      console.error("Error during sign-in", err);
      setErrorMessage("We couldn't sign you in. Please try again.");
      setIsConnecting(false);
    }    
  };
  return (
    <div className="login-page">
      <section className="login-story" aria-label="Task Manager overview">
        <div className="login-brand">
          <div className="brand-mark" aria-hidden="true">
            <Check size={20} strokeWidth={3} />
          </div>
          <span>Task Manager</span>
        </div>

        <div className="story-copy">
          <div className="story-kicker">
            <span></span>
            Plan with clarity
          </div>
          <h1>Turn your team&apos;s plans into progress.</h1>
          <p>Organize work, track every detail, and keep everyone moving in the same direction.</p>
        </div>

        <div className="workspace-preview" aria-hidden="true">
          <div className="preview-glow"></div>
          <div className="preview-window">
            <div className="preview-sidebar">
              <div className="preview-logo"><Check size={12} strokeWidth={3} /></div>
              <span className="preview-nav active"></span>
              <span className="preview-nav"></span>
              <span className="preview-nav"></span>
              <div className="preview-avatar"></div>
            </div>
            <div className="preview-content">
              <div className="preview-header">
                <div>
                  <span className="preview-eyebrow"></span>
                  <span className="preview-title"></span>
                </div>
                <div className="preview-team">
                  <span></span><span></span><span></span>
                </div>
              </div>
              <div className="preview-board">
                <div className="board-column">
                  <div className="board-heading"><span>To do</span><b>3</b></div>
                  <div className="task-card">
                    <span className="task-tag purple"></span>
                    <strong>Design review</strong>
                    <div className="task-meta"><span></span><span></span></div>
                  </div>
                  <div className="task-card compact">
                    <span className="task-tag orange"></span>
                    <strong>Research notes</strong>
                  </div>
                </div>
                <div className="board-column">
                  <div className="board-heading"><span>In progress</span><b>2</b></div>
                  <div className="task-card featured">
                    <span className="task-tag blue"></span>
                    <strong>Homepage updates</strong>
                    <div className="progress-line"><i></i></div>
                    <div className="task-meta"><span></span><span></span></div>
                  </div>
                  <div className="task-card compact">
                    <span className="task-tag green"></span>
                    <strong>Update docs</strong>
                  </div>
                </div>
                <div className="board-column">
                  <div className="board-heading"><span>Done</span><b>4</b></div>
                  <div className="task-card done-card">
                    <span className="done-check"><Check size={9} strokeWidth={3} /></span>
                    <strong>Project kickoff</strong>
                    <div className="task-meta"><span></span><span></span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="story-features">
          <div><Layers3 size={17} /><span>Organized boards</span></div>
          <div><UsersRound size={17} /><span>Built for teams</span></div>
        </div>
      </section>

      <main className="login-panel">
        <div className="login-card">
          <div className="mobile-brand">
            <div className="brand-mark" aria-hidden="true">
              <Check size={18} strokeWidth={3} />
            </div>
            <span>Task Manager</span>
          </div>

          <div className="login-heading">
            <span className="login-label">Welcome back</span>
            <h2>Sign in to your workspace</h2>
            <p>Continue with Google to access your projects.</p>
          </div>

          <div className={`google-login-wrap${isConnecting ? " is-loading" : ""}`}>
            {isConnecting ? (
              <div className="connecting-state" role="status">
                <span className="spinner"></span>
                Signing you in...
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleSignIn}
                onError={() => {
                  setErrorMessage("Google sign-in was cancelled or failed. Please try again.");
                }}
                theme="outline"
                size="large"
                width="280"
                shape="pill"
              />
            )}
          </div>

          {errorMessage && (
            <div className="login-error" role="alert">{errorMessage}</div>
          )}

          <p className="login-terms">
            By continuing, you agree to the Terms of Service and Privacy Policy.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
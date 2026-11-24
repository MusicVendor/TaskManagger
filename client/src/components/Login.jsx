import React from "react";
import { GoogleLogin } from '@react-oauth/google';
import { API_URL } from "../api";

function Login({onClick }) {

  const handleSignIn = async (credentialResponse) => {
    const googleToken = credentialResponse.credential;
    
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
    }    
  };

  // const signOut = () => {
  //   var auth2 = gapi.auth2.getAuthInstance();
  //   auth2.signOut().then(function () {
  //     console.log('User signed out.');
  //   });
  // } 
  return (
    <div className='m-auto mt-70 h-px 50'>
      <h1 className="px-8 py-4 text-xl font-medium">Sign in using Google</h1>
    <GoogleLogin
      onSuccess={handleSignIn}
      onError={() => {
        console.log('Login Failed');
      }}
      theme="outline"
      size="large"
      width="280"
      shape="rectangular"

    />
    {/* <a href="#" onclick="signOut();">Sign out</a> Use it to add SignOut option*/} 
    </div>
  );
}

export default Login;
import React, { useContext, useEffect, useState } from 'react';
import profilePic from '../assets/profile-pic.png';
import logoUpdate from '../assets/logo-updates.png';
import logoSetting from '../assets/logo-setting.png';
import logoSearch from '../assets/logo-search.png';
import logoAdd from '../assets/logo-add.png';
import './NavBar.css';
import {AuthContext} from '../App';
import Layout from './layout';
 
function NavBar() {
  const [projects, setProjects] = useState([]);
  const {token, user} = useContext(AuthContext);

  const fetchProject = async () => {
      try{
        const res = await fetch(`http://localhost:2300/projects`,{
          method : 'GET',
          headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if(!res.ok){
          throw new Error('Failed to fetch projects');
        }

        const data = await res.json();
        setProjects(data.projects);

      } catch(err){
        console.log("Error fetching Projects", err);
      }
    }

  useEffect (() =>{
    if(token)
    fetchProject();
  }, [token, projects]);

  return (
    <Layout>
      <h1>Welcome {user?.first_name}</h1>
      <p>Projects</p>
    </Layout>
  )
};

export default NavBar;
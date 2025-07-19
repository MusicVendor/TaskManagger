import React from 'react'
import { NavLink } from 'react-router'
import profilePic from '../assets/profile-pic.png'
import logoUpdate from '../assets/logo-updates.png'
import logoSetting from '../assets/logo-setting.png'
import logoSearch from '../assets/logo-search.png'
import logoAdd from '../assets/logo-add.png'
import './NavBar.css'
import MainContent from './MainContent'



function NavBar(props) {
    return (
    <div className='left-navBar'>
        <div className='profile'>
            <img src= {profilePic} className='profile-pic' alt='User Profile Pic'/>
            <p className='profile-greeting'>Welcome! <span className='profile-user'>{props.userName}</span>
            </p>
        </div>
        <ul className='options'>
            <li className='options-search'><img src={logoSearch} className='logo'/>Search</li>
            <li className='options-updates'><img src={logoUpdate} className='logo'/>Updates</li>
            <li className='options-setting'><img src={logoSetting} className='logo'/>Settings</li>
        </ul>
        <div className='projects'>
            <div className="projects-header">
                <h2 className='projects-head'>Projects</h2> 
                <img src={logoAdd} className='projects-addLogo' style={{height: '14.6px', width: '14.6px'}}/> {/*Need high pixel logo*/}
                
            </div>
            {props.category.map((categories) => (
                <div key={categories.type} className='projects-category'>
                    <h3>{categories.type}</h3>
                    <ul>
                        <nav>
                            {categories.projects.map((project, index) => (
                                <NavLink to={`/${project}`} key={index} className={({isActive}) => isActive?"active-link":"link"}>
                                    <li>{project}</li>
                                    {/* <MainContent name={project}/> */}
                                </NavLink>
                            ))}
                        </nav>
                    </ul>
                </div>
            ))}

        </div>
    </div>
    )
}

export default NavBar
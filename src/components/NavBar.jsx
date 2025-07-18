import React from 'react'
import profilePic from '../assets/profile-pic.png'
import logoUpdate from '../assets/logo-updates.png'
import logoSetting from '../assets/logo-setting.png'
import logoSearch from '../assets/logo-search.png'
import logoAdd from '../assets/logo-add.png'
import './NavBar.css'



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
            <div className='projects-category'>
                <h3>Private</h3>
                <ul className='projects-pages'>
                    <li>{props.privateName}</li>
                </ul>
            </div>
            <div className='projects-category'>
                <h3>Shared</h3>
                <ul className='projects-pages'>
                    <li>{props.sharedName}</li>
                </ul>
            </div>
        </div>
    </div>
    )
}

export default NavBar
import React from 'react'
import './TaskColumn.css'
import logoAdd from '../assets/logo-add.png'
import Card from './Card.jsx'

function TaskColumn(props){
    return (
    <>
        <div className='progress'>
            <div className="progress--status">
                <h3 className='progress--status--header'>{props.status}</h3>
                <img src={logoAdd} className='progress--status--addLogo' style={{width:'14px', height:'14px'}}/>
            </div>
        <hr className='divider'/>
        <Card 
        type="Design"
        title="User Interface Screen"
        description="Design user interface Screen"
        date="12th July, 2025"/>
        </ div>
    </>
    )
}

export default TaskColumn

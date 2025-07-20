import React from 'react'
import './MainContent.css'
import TaskColumn from './TaskColumn.jsx'

function MainContent(props){
    return (
    <div className='main'>
        <div className="main--header">
            <h1>{props.title}</h1>
            <ul className='main--options'>
                <li className='share'>Share</li>
                <li className='report'>Report</li>
            </ul>
        </div>
        <div className="main--progress">
            <TaskColumn status="To Do" task={props.task.todo}/>
            <TaskColumn status="In Progress" task={props.task.inprogress}/>
            <TaskColumn status="Completed" task={props.task.completed}/>
        </div>
        </div>
    )
}

export default MainContent
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
        {props.task.map((element, index)=>(
            <Card 
            key={index} 
            tag={element.tag}
            title={element.title}
            description={element.description}
            deadline={element.deadline}/>
        ))}
        </ div>
    </>
    )
}

export default TaskColumn

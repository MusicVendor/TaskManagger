import React from 'react'
import './Card.css'
function Card(props){
    return(
        <div className='card'>
            <div className="card--cotent">
                <div className="card--header">
                    <p className='card--type'>{props.tag}</p>
                </div>
                <h1 className='card--title'>{props.title}</h1>
                <p className='card--description'>{props.description}</p>
                <p className="card--deadline">Complete by: <span className='card--deadline--date'>{props.deadline}</span></p>
            </div>
        </ div>
    )
}

export default Card
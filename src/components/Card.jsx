import React from 'react'
import './Card.css'
function Card(){
    return(
        <div className='card'>
            <div className="card--cotent">
                <div className="card--header">
                    <p className='card--type'>Design</p>
                </div>
                <h1 className='card--title'>User Interface Screens</h1>
                <p className='card--description'>Design task manager user interface screen</p>
                <p className="card--deadline">Complete by: <span className='card--deadline--date'>12th July, 2025</span></p>
            </div>
        </ div>
    )
}

export default Card
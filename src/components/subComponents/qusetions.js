import React from 'react'
import { Link } from 'react-router-dom'

const Question = ({data}) => {
    console.log(data)
    const linkToQ = '/question/' + data._id
    let question = data.question
    if(data.question.length > 50){
        question = data.question.substr(0,50) + '...'
    }else{
        question = data.question
    }
    const dateData = new Date(data.createdAt)
    const date = dateData.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric' }).replace(/, /g, '-')
    const time = dateData.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    return (
        <Link className="QLink" to={linkToQ}>
            <div className="QWrapper">
                <div className="QAvatar">
                    <img className="QImage" height="40px" width="40px" src={data.avatar ? data.avatar : '/icons/anonymous.png'} alt="asker"/>
                </div>
                <div className="QBody">
                    <div className="QQuestion">
                        <p>{question}</p>
                    </div>
                    <div className="QDescription">
                        <div className="AskedBy">
                            <p>{data.name}</p>
                        </div>
                        <div className="isPrivate">
                            {data.isPrivate ? <p>Private</p> : <p>Public</p>}
                        </div>
                        <div className="dateTimeQ">
                            <p className="dateTime">{date}</p>
                            <p className="dateTime">{time}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Question
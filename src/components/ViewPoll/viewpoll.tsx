import React from 'react'
import { Error, Poll } from '../Main/main'
import { Bar } from 'react-chartjs-2'

import './viewpoll.scss'

interface Props {
    poll: Poll | null;
    error: Error | null;
}

const ViewPoll = (props:Props) => {
    let data ={}
    if (props.poll) {
        data["labels"] = props.poll.question
        data["count"] = Object.values(props.poll.pollQuestions).filter(item => item.count)
        data["datasets"] = Object.values(props.poll.pollQuestions).filter(item => item.pollOption)
    }
    console.log(data)
    return (
        <div className="create-poll results">
            {props.poll && (
                <Bar 
                data={data}
                />
            )}
        </div>
    )
}

export default ViewPoll
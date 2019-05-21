import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom'
import { Poll, Error } from '../Main/main'

import './vote.scss'

interface IProps extends RouteComponentProps<{ id: string }> {
    ws: WebSocket;
    poll: Poll | null;
    error: Error | null;
}


const ViewPoll = (props: IProps) => {
    const { error, poll } = props

    const [selected, setSelected] = useState<string>("")
    return (
        <div className="create-poll vote-poll">
            {error && (
                <div className="vote-error">
                    <span>{error.message}</span>
                    <Link className="error-button" to="/">Create new poll</Link>
                </div>
            )}
            {poll && (
                <div className="vote-success">
                    <span className="poll-question">{poll.question}</span>
                    <div className="poll-questions">
                        {Object.keys(poll.pollquestions).map(key => {
                            const { pollquestions } = poll
                            return (
                                <label key={key} >
                                    {pollquestions[key].question}
                                    <input
                                        type="radio"
                                        name={key}
                                        checked={selected === key ? true : false}
                                        onChange={(e) => setSelected(e.target.name)}
                                    />
                                </label>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ViewPoll
import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom'
import { Poll, Error } from '../Main/main'
import { Radio } from '@material-ui/core'
import './vote.scss'

interface IProps extends RouteComponentProps<{ id: string }> {
    ws: WebSocket;
    poll: Poll | null;
    error: Error | null;
}


const ViewPoll = (props: IProps) => {
    const { error, poll } = props

    const [selected, setSelected] = useState<string>("")

    const notTicked = selected.length > 0 ? false : true
    console.log(selected.length)
    return (
        <div className="create-poll vote-poll">
            {!poll && (
                <h2
                    style={{ margin: "auto" }}
                    className="poll-question">Fetching Poll...</h2>
            )}
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
                        {Object.keys(poll.pollQuestions).map(key => {
                            const { pollQuestions } = poll
                            return (
                                <div className="quest" key={key}>
                                    <Radio
                                        className="radio-button"
                                        name={key}
                                        checked={selected === key ? true : false}
                                        onChange={(e) => setSelected(e.target.name)}
                                    />
                                    <label>
                                        {pollQuestions[key].pollOption}
                                    </label>
                                </div>
                            )
                        })}
                    </div>
                    <button
                        className={`submit-button ${notTicked ? "disable-btn" : ""}`}
                        disabled={notTicked}
                        onClick={() => {
                            console.log('penis')
                            const { ws } = props
                            const payload = {
                                id: props.match.params.id,
                                upvote: selected,
                                type: "upvote"
                            }
                            ws.send(JSON.stringify(payload))
                            props.history.push(`/view/${props.match.params.id}`)
                        }}
                    >
                        {notTicked ? "Select..." : "Submit"}
                        </button>
                </div>
            )}
        </div>
    )
}

export default ViewPoll
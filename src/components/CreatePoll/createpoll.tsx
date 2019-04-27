import React, { Component } from 'react'
import './createpoll.scss'


interface State {
    [key: string]: any;
    counter: number;
    question: string;
    poll1: string;
    poll2: string;
    poll3: string;
    poll4: string;
    poll5: string;
    poll6: string;
    poll7: string;
    poll8: string;
}
class CreatePoll extends Component<{}, State> {
    state: State = {
        counter: 3,
        question: "",
        poll1: "",
        poll2: "",
        poll3: "",
        poll4: "",
        poll5: "",
        poll6: "",
        poll7: "",
        poll8: ""
    }
    componentDidUpdate() {
        
    }
    render() {
        return (
            <div className="create-poll">
                <div className="poll-content">
                    {Object.keys(this.state).map((key: string) => {
                        if (key === "counter") return
                        return (
                            <input value={this.state[key]}
                            key={key}
                            onChange={(e) => this.setState({[key]: e.target.value})}
                            placeholder={key === "question" ? "type a question here" : ""}
                            />
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default CreatePoll
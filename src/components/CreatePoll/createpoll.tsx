import React, { Component } from 'react'
import './createpoll.scss'


export interface CState {
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
class CreatePoll extends Component<{}, CState> {
    state: CState = {
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
    componentDidUpdate(prevProps: {}, prevState: CState) {
        const { counter } = this.state
        const key = this.state[`poll${counter - 1}`]
        if (key && key.length > 0) this.setState({ counter: counter + 1 })
    }
    render() {
        return (
            <div className="create-poll">
                <div className="poll-content">
                    {Object.keys(this.state).map((key: string, i: number) => {
                        if (key === "counter" || i > this.state.counter) return
                        return (
                            <input value={this.state[key]}
                                key={key}
                                onChange={(e) => this.setState({ [key]: e.target.value })}
                                placeholder={key === "question" ? "Type a question here" : ""}
                            />
                        )
                    })}
                    <div className="button">
                        <button>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreatePoll
import React, { Component } from 'react'
import './createpoll.scss'
import { RouteComponentProps } from 'react-router';


export interface CState {
    counter: number;
    question: string;
    pollQuestions: PollQ;
}

interface PollQ {
    [key: string]: any;
    poll1: string;
    poll2: string;
    poll3: string;
    poll4: string;
    poll5: string;
    poll6: string;
    poll7: string;
    poll8: string;
}

interface Props extends RouteComponentProps<{ id: string }> {
    setWs: Function;
}
class CreatePoll extends Component<Props, CState> {
    state: CState = {
        counter: 2,
        question: "",
        pollQuestions: {
            poll1: "",
            poll2: "",
            poll3: "",
            poll4: "",
            poll5: "",
            poll6: "",
            poll7: "",
            poll8: ""
        }
    }
    componentDidUpdate(prevProps: Props, prevState: CState) {
        const { counter } = this.state
        const key = this.state.pollQuestions[`poll${counter}`]
        if (key && key.length > 0) this.setState({ counter: counter + 1 })
    }
    render() {
        const { question } = this.state
        return (
            <div className="create-poll">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        try {
                            const { pollQuestions, question } = this.state
                            if (question.length === 0) return
                            const pollFiltered = Object.keys(pollQuestions).map(key => {
                                if (pollQuestions[key].length === 0) return
                                return { [key]: pollQuestions[key] }
                            }).filter(item => item)
                            const payload = {
                                question,
                                pollQuestions: pollFiltered
                            }
                            this.sendPayload(payload)
                            
                        } catch(err) {
                            console.log(err)
                        }
                    }}
                >
                    <div className="poll-content">
                        <input 
                        value={question}
                        onChange={(e) => this.setState({question: e.target.value})}
                        placeholder="Enter your question here"
                        />
                        {Object.keys(this.state.pollQuestions).map((key: string, i: number) => {
                            if (i >= this.state.counter) return
                            return (
                                <input value={this.state.pollQuestions[key]}
                                    key={key}
                                    onChange={(e) => {
                                        const shallow = this.state.pollQuestions
                                        shallow[key] = e.target.value
                                        this.setState({pollQuestions: shallow})
                                    }}
                                    placeholder={"Enter poll option"}
                                    name={key}
                                />
                            )
                        })}
                        <div className="button">
                            <button>
                                Submit
                        </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
    async sendPayload(payload: any) {
        console.log(payload)
        const send = await fetch("/createpoll", {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        const data = await send.json();
        console.log(data)
    }
}

export default CreatePoll
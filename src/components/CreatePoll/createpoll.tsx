import React, { Component } from 'react'
import './createpoll.scss'
import { RouteComponentProps } from 'react-router';


export interface CState {
    counter: number;
    question: string;
    pollQuestions: PollQ;
    waiter: boolean;
    error: string | null;
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

interface IProps extends RouteComponentProps<{ id: string }> {
}

class CreatePoll extends Component<IProps, CState> {
    state: CState = {
        counter: 2,
        error: null,
        waiter: false,
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
    componentDidUpdate(prevProps: RouteComponentProps<{ id: string }>, prevState: CState) {
        const { counter } = this.state
        const key = this.state.pollQuestions[`poll${counter}`]
        if (key && key.length > 0) this.setState({ counter: counter + 1 })
    }
    render() {
        const { question, error, waiter } = this.state
        return (
            <div className="create-poll">
                {(error && (
                    <span className="error">{error}</span>
                ))}
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        try {
                            const { pollQuestions, question } = this.state
                            if (question.length === 0) throw "Please enter a question"
                            const questions = Object.values(pollQuestions)
                            for (let x = 0; x <= 1; x++) {
                                const len = questions[x].length
                                if (len === 0) throw "Poll must have atleast 2 questions"
                                if (len > 48) throw `Question ${x + 1} is too long`
                            }
                            const pollFiltered = [...Object.keys(pollQuestions)].map(key => {
                                if (pollQuestions[key].length === 0) return
                                return { [key]: pollQuestions[key] }
                            }).filter(item => item).reduce((obj, i) => {
                                const key = Object.keys(i)
                                const value = Object.values(i)
                                obj[key[0]] = {pollOption: value[0]}
                                return obj
                            }, {})
                            const payload = {
                                question,
                                pollQuestions: pollFiltered
                            }
                            this.sendPayload(payload)

                        } catch (err) {
                            if (typeof err === 'string') {
                                this.setState({ error: err })
                            }
                        }
                    }}
                >
                    <div className="poll-content">
                        <input
                            value={question}
                            onChange={(e) => this.setState({ question: e.target.value })}
                            placeholder="Enter your question here"
                            autoComplete="off"
                        />
                        {Object.keys(this.state.pollQuestions).map((key: string, i: number) => {
                            if (i >= this.state.counter) return
                            return (
                                <input value={this.state.pollQuestions[key]}
                                    key={key}
                                    onChange={(e) => {
                                        const shallow = this.state.pollQuestions
                                        shallow[key] = e.target.value
                                        this.setState({ pollQuestions: shallow })
                                    }}
                                    placeholder={"Enter poll option"}
                                    name={key}
                                    autoComplete="off"
                                />
                            )
                        })}
                        <div className="button">
                            <button className={`submit-button ${waiter ? "off-button" : ""}`}>
                                {waiter ? "Waiting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
    async sendPayload(payload: any) {
        if (this.state.waiter) return
        console.log(payload)
        try {
            const send = await fetch("/createpoll", {
                method: 'POST',
                body: JSON.stringify(payload)
            })
            const data: string = await send.json();
            if (!data) return
            this.props.history.push(`/vote/${data}`)
        } catch (err) {
            this.setState({ error: "Server not responding try again", waiter: true }, () => {
                setTimeout(() => this.setState({ waiter: false, error: null }), 3500)
            })
        }
    }
}

export default CreatePoll
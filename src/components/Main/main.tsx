import React, { Component } from 'react'
import { Switch, Route, withRouter, matchPath } from 'react-router-dom'
import { RouteComponentProps, match } from 'react-router'
import './main-styles.scss'

import CreatePoll from '../CreatePoll/createpoll'
import ViewPoll from '../ViewPoll/viewpoll'
import VotePoll from '../VotePoll/vote'
import Nav from '../Nav/navbar'

interface State {
    ws: WebSocket | null;
    poll: Poll | null;
    creator: boolean;
    pollId: ID | null;
    error: Error | null;
}
export interface Poll {
    pollQuestions: PollQuestions;
    type: string;
    question: string;

}
interface PollQuestions {
    count: string;
    [poll: string]: string;
}
interface Error {
    error: string;
    message: string;
    type: string;
}
interface ID {
    id: string;
    param: string;
}
class Homepage extends Component<RouteComponentProps, State> {
    state = {
        ws: null,
        poll: null,
        creator: false,
        pollId: null,
        error: null
    }
    componentWillUnmount() {
        if (this.state.ws) {
            this.state.ws.removeEventListener('message', this.readWs)
        }
    }
    render() {

        this.checkRoute()
        return (
            <div className="main">
                    <Nav />
                    <Switch>
                        <Route path="/view/:id" render={(props) => <ViewPoll {...props} setWs={this.setWs} />} />
                        <Route path="/vote/:id" render={(props) => <VotePoll {...props} ws={this.state.ws} setWs={this.setWs} poll={this.state.poll} />} />
                        <Route path="/" render={(props) => <CreatePoll {...props} setWs={this.setWs} />} />
                    </Switch>
            </div>
        )
    }
    setWs = (id: string) => {
        if (id === this.state.pollId) return
        const webStr = `ws://${document.location.hostname}:5000/socket/${id}`
        this.setState({ ws: new WebSocket(webStr), creator: true }, () => {
            if (this.state.ws) {
                this.state.ws.addEventListener('message', this.readWs)
            }
        })
    }
    readWs = (msg: any) => {
        if (!msg.data) return
        const result = JSON.parse(msg.data)
        if (result.error) {
            switch (result.type) {
                case "invalid_id":
                    result.message = "The ID entered seems to be invalid"
                    this.setState({ error: result, poll: null })
                    break;
            }
            return
        } else if (this.state.error) {
            this.setState({ error: null, poll: result })
            return
        }
        this.setState({ poll: result })
    }
    checkRoute = () => {
        const match: match<{id: string}> = matchPath(this.props.history.location.pathname, {
            path: '/:param/:id',
            exact: true,
            strict: false
          })
          if (match && match.params.id) {
              console.log("weeee")
          }
    }
}

export default withRouter(Homepage)
import React, { Component } from 'react'
import { Switch, Route, withRouter, matchPath } from 'react-router-dom'
import { RouteComponentProps, match } from 'react-router'
import './main-styles.scss'

import CreatePoll from '../CreatePoll/createpoll'
import ViewPoll from '../ViewPoll/viewpoll'
import VotePoll from '../VotePoll/vote'
import Nav from '../Nav/navbar'
import SharePoll from '../SharePoll/sharepoll'

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
    _id: string;

}
interface PollQuestions {
    count: string;
    pollOption: string
}
export interface Error {
    error: string;
    message: string;
    type: string;
}
interface ID {
    id: string;
    param: string;
}
const checkRoute = (path: string) => {
    const match: match<{ id: string, param: string }> = matchPath(path, {
        path: '/:param/:id',
        exact: true,
        strict: false
    })
    if (match && match.params.id.length > 0) {
        return match.params
    } else {
        return null
    }
}
class Homepage extends Component<RouteComponentProps, State> {
    state = {
        ws: null,
        poll: null,
        creator: false,
        pollId: checkRoute(this.props.location.pathname),
        error: null
    }
    componentWillUnmount() {
        if (this.state.ws) {
            this.state.ws.removeEventListener('message', this.readWs)
        }
    }
    componentDidMount() {
        const { pollId, ws } = this.state
        if (!ws && pollId && pollId.id.length > 0) {
            const webStr = `ws://${document.location.hostname}:5000/socket/${pollId.id}`
            this.setState({ ws: new WebSocket(webStr) }, () => this.setMessage())
        }
    }
    componentDidUpdate() {
        const { pollId, ws } = this.state
        const route = checkRoute(this.props.location.pathname)
        if (route) {
            if (!pollId || pollId && pollId.id !== route.id) {
                if (ws) ws.close()
                const webStr = `ws://${document.location.hostname}:5000/socket/${route.id}`
                this.setState({ pollId: route, ws: new WebSocket(webStr) }, () => this.setMessage())
            }
        } else {
            if (pollId) {
                ws.close()
                ws.removeEventListener('message', this.setMessage)
                this.setState({ pollId: null, ws: null, poll: null })
            }
        }
    }
    render() {
        console.log(this.state)
        return (
            <div className="main">
                <Nav />
                    <SharePoll id={this.state.poll ? this.state.poll._id : null } />
                <Switch>
                    <Route path="/view/:id" render={(props) => <ViewPoll {...props} poll={this.state.poll} />} />
                    <Route path="/vote/:id" render={(props) => <VotePoll {...props} ws={this.state.ws} poll={this.state.poll} error={this.state.error} />} />
                    <Route path="/" render={(props) => <CreatePoll {...props} />} />
                </Switch>
            </div>
        )
    }
    setMessage = () => {
        const { ws } = this.state
        ws.addEventListener('message', this.readWs)
    }
    readWs = (msg: any) => {
        if (!msg.data) return
        const result = JSON.parse(msg.data)
        if (result.error) {
            this.handleError(result)
            return
        } else if (this.state.error) {
            this.setState({ error: null, poll: result })
            return
        }
        switch (result.type) {
            case "upvote":
                const shallow = this.state.poll
                shallow.pollQuestions[result.upvote].count += 1
                this.setState({ poll: shallow })
                break;
            default:
                this.setState({ poll: result })
        }
    }
    handleError = (err: Error) => {
        switch (err.type) {
            case "invalid_id":
                err.message = "The ID entered seems to be invalid"
            case "not_found":
                err.message = "Poll could not be found"
            case "duplicate_ip":
                this.setState({ error: err })
                break;
            default:
                this.setState({ error: err, poll: null })
        }
    }
}

export default withRouter(Homepage)
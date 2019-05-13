import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './main-styles.scss'

import CreatePoll from '../CreatePoll/createpoll'
import ViewPoll from '../ViewPoll/viewpoll'

interface State {
    ws: WebSocket | null;
    result: any;
}

class Homepage extends Component<{}, State> {
    state = {
        ws: null,
        result: null
    }
    render() {
        console.log(this.state.ws)
        return (
            <div className="main">
                <BrowserRouter>
                    <Switch>
                        <Route path="/:id" render={(props) => <ViewPoll {...props} setWs={this.setWs} /> } />
                        <Route path="/" render={(props) => <CreatePoll {...props} setWs={this.setWs} /> } />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
    setWs = (id: string) => {
        console.log(id)
        const webStr = `ws://${document.location.hostname}:5000/socket/${id}`
        this.setState({ws: new WebSocket(webStr)})
    }
}

export default Homepage
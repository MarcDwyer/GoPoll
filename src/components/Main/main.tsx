import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './main-styles.scss'

import CreatePoll from '../CreatePoll/createpoll'

interface State {
    ws: WebSocket;
    result: any;
}

class Homepage extends Component<{}, State> {
    state = {
        ws: new WebSocket(`ws://${document.location.hostname}:5000/socket/`),
        result: null
    }
    render() {
        return (
            <div className="main">
                <BrowserRouter>
                    <Switch>
                        <Route path="/" component={CreatePoll} />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}

export default Homepage
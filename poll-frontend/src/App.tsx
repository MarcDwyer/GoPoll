import React, { useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { Homepage } from "./paths/Homepage/homepage";
import { observer } from "mobx-react-lite";
import { PollStore } from "./stores/poll_store";
import { Navbar } from "./components/Navbar/navbar";

import "./App.scss";
import { MySocket } from "./my_socket";
import { VotePoll } from "./components/VotePoll/votepoll";

type Props = {
  pollStore: PollStore;
};

export const App = observer(({ pollStore }: Props) => {
  const history = useHistory();
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:1992/");
    ws.onopen = () => (pollStore.mySocket = new MySocket(ws));
    ws.onerror = (e) => console.error(e);
  }, []);

  useEffect(() => {
    if (pollStore.mySocket) {
      pollStore.setListeners();
    }
  }, [pollStore.mySocket]);

  useEffect(() => {
    if (pollStore.poll) {
      history.push(`/vote/${pollStore.poll.id}`);
    }
  }, [pollStore.poll]);

  return (
    <div className="app">
      <Navbar />
      <div className="inner-app">
        <Switch>
          <Route
            render={(p) => <VotePoll {...p} pollStore={pollStore} />}
            path="/vote/:id"
          />
          <Route
            component={() => <Homepage pollStore={pollStore} />}
            path="/"
          />
        </Switch>
      </div>
    </div>
  );
});

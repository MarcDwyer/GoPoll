import React, { useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { Homepage } from "./paths/Homepage/homepage";
import { observer } from "mobx-react-lite";
import { PollStore } from "./stores/poll_store";
import { Navbar } from "./components/Navbar/navbar";

import "./App.scss";
import { MySocket } from "./my_socket";

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
    <Switch>
      <div className="app">
        <Navbar />
        <div className="inner-app">
          <Route
            component={() => <Homepage pollStore={pollStore} />}
            path="/"
          />
        </div>
      </div>
    </Switch>
  );
});

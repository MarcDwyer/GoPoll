import React, { useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Homepage } from "./paths/Homepage/homepage";
import { observer } from "mobx-react-lite";
import { MySocket, PollStore } from "./stores/poll_store";
import { Navbar } from "./components/Navbar/navbar";

import "./App.scss";

type Props = {
  pollStore: PollStore;
};

export const App = observer(({ pollStore }: Props) => {
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
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
});
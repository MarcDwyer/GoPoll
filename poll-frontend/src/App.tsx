import React, { useEffect } from "react";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";
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

  const loc = useLocation();

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
    console.log(pollStore.poll);
    if (pollStore.poll) {
      history.push(`/vote/${pollStore.poll.id}`);
    }
  }, [pollStore.poll]);

  useEffect(() => {
    const path = loc.pathname;

    if (path === "/" && pollStore.poll && pollStore.mySocket) {
      //unsub from previous poll
      pollStore.unsubscribe();
    }
  }, [loc.pathname]);
  // Should prevent components from loading until WS connection is open
  return (
    <div className="app">
      <Navbar />
      <div className="inner-app">
        <Switch>
          {pollStore.mySocket && (
            <>
              <Route
                render={(p) => <VotePoll {...p} pollStore={pollStore} />}
                path="/vote/:id"
              />
              <Route
                component={() => <Homepage pollStore={pollStore} />}
                exact
                path="/"
              />
            </>
          )}
        </Switch>
      </div>
    </div>
  );
});

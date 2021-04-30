import React from "react";
import ReactDOM from "react-dom";
import { App } from "./src/App";
import { PollStore } from "./src/stores/poll_store";
import { BrowserRouter } from "react-router-dom";

const root = document.querySelector(".root");
try {
  if (!root) throw "root could not be found";

  const pollStore = new PollStore();

  ReactDOM.render(
    <BrowserRouter>
      <App pollStore={pollStore} />
    </BrowserRouter>,
    root
  );
} catch (e) {
  console.error(e);
}

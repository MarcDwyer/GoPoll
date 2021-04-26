import React from "react";
import ReactDOM from "react-dom";
import { App } from "./src/App";
import { PollStore } from "./src/stores/poll_store";

const root = document.querySelector(".root");
try {
  if (!root) throw "root could not be found";

  const pollStore = new PollStore();

  ReactDOM.render(<App pollStore={pollStore} />, root);
} catch (e) {
  console.error(e);
}

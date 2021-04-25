import React from "react";
import ReactDOM from "react-dom";
import { App } from "./src/components/App";
import { PollStore } from "./src/components/stores/poll_store";

const root = document.querySelector(".root");
try {
  if (!root) throw "root could not be found";

  const pollStore = new PollStore();

  ReactDOM.render(<App pollStore={pollStore} />, root);
} catch (e) {
  console.error(e);
}

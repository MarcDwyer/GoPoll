import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { App } from "./src/App";
import { PollStore } from "./src/stores/poll_store";
import { Router } from "react-router";

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

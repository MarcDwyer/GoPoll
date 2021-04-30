import { WebSocketClient } from "https://deno.land/x/websocket@v0.1.1/mod.ts";
import { Poll } from "./type_defs.ts";

type Conns = Map<WebSocketClient, boolean>;
export class PollRoom {
  conns: Conns = new Map();

  constructor(public poll: Poll) {}

  addCon(ws: WebSocketClient) {
    this.conns.set(ws, true);
  }
  removeConn(ws: WebSocketClient) {
    this.conns.delete(ws);
  }

  broadcast() {}
}

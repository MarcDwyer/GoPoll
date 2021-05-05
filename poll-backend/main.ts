import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.1/mod.ts";
import { Hub } from "./hub.ts";

const wss = new WebSocketServer(1992);

export type WebSocketRequest = {
  type: string;
  payload: any;
};

export enum ReqTypes {
  createPoll = "createPoll",
  subscribe = "subscribe",
  unsubscribe = "unsubscribe",
}

export enum RecTypes {
  pollInfo = "pollInfo",
  unsubscribe = "unsubscribe",
}

const hub = new Hub();

wss.on("connection", function (ws: WebSocketClient) {
  ws.on("message", function (msg: string) {
    try {
      const request: WebSocketRequest = JSON.parse(msg);

      switch (request.type) {
        case ReqTypes.createPoll:
          const pr = hub.createPoll(request.payload);
          pr.addCon(ws);
          // no type here
          ws.send(
            JSON.stringify({
              type: RecTypes.pollInfo,
              payload: { pollInfo: pr.poll },
            })
          );
          break;
        case ReqTypes.subscribe:
          const { id } = request.payload;
          const pollInfo = hub.subscribe(id, ws);
          // no type here
          ws.send(
            JSON.stringify({
              type: RecTypes.pollInfo,
              payload: { pollInfo },
            })
          );
          break;
        case ReqTypes.unsubscribe:
          const uid = request.payload.id;
          const resp = hub.unsubscribe(uid, ws);
          ws.send(
            JSON.stringify({ type: RecTypes.unsubscribe, payload: resp })
          );
          break;
        default:
          console.log(`Default ran: `);
      }
    } catch (e) {
      console.error(e);
    }
  });
});

export {};

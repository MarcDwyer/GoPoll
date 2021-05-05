import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.1/mod.ts";
import { HandleRequest } from "./handle_requests.ts";

const wss = new WebSocketServer(1992);

export type WebSocketRequest = {
  type: string;
  payload: any;
};

export enum ReqTypes {
  createPoll = "createPoll",
}

export enum RecTypes {
  subscribe = "subscribe",
}

const handleReq = new HandleRequest();

wss.on("connection", function (ws: WebSocketClient) {
  ws.on("message", function (msg: string) {
    try {
      const request: WebSocketRequest = JSON.parse(msg);

      switch (request.type) {
        case ReqTypes.createPoll:
          const pr = handleReq.createPoll(request.payload);
          pr.addCon(ws);
          ws.send(JSON.stringify(pr.poll));
          break;
        case RecTypes.subscribe:
          const { id } = request.payload;
          const res = handleReq.subscribe(id, ws);
          ws.send(JSON.stringify(res));
        default:
          console.log(`Default ran: `);
      }
    } catch (e) {
      console.error(e);
    }
  });
});

export {};

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

export enum Types {
  createPoll = "createPoll",
}

const handleReq = new HandleRequest();

wss.on("connection", function (ws: WebSocketClient) {
  ws.on("message", function (msg: string) {
    try {
      const request: WebSocketRequest = JSON.parse(msg);

      switch (request.type) {
        case Types.createPoll:
          console.log(handleReq.createPoll(request.payload));
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

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
  pollInfo = "pollinfo",
}

const handleReq = new HandleRequest();

wss.on("connection", function (ws: WebSocketClient) {
  ws.on("message", function (msg: string) {
    try {
      const request: WebSocketRequest = JSON.parse(msg);

      switch (request.type) {
        case ReqTypes.createPoll:
          const poll = handleReq.createPoll(request.payload);
          ws.send(
            JSON.stringify({
              payload: poll,
              type: RecTypes.pollInfo,
            })
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

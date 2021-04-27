import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.1/mod.ts";

const wss = new WebSocketServer(1992);

export type WebSocketRequest = {
  type: string;
  payload: any;
};

export enum Types {
  createPoll = "createPoll",
}
wss.on("connection", function (ws: WebSocketClient) {
  ws.on("message", function (msg: string) {
    try {
      const request: WebSocketRequest = JSON.parse(msg);

      switch (request.type) {
        case Types.createPoll:
          console.log(request.payload);
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

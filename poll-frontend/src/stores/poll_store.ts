import { action, computed, makeObservable, observable } from "mobx";
import { MySocket } from "../my_socket";
import { Poll } from "../type_defs";
import { PollPost } from "./create_poll_store";

export type Payload = {
  type: string;
  payload: any;
};
export enum ReqTypes {
  createPoll = "createPoll",
}
export enum RecTypes {
  pollInfo = "pollinfo",
}
export class PollStore {
  mySocket: MySocket | null = null;

  poll: Poll | null = null;

  constructor() {
    makeObservable(this, {
      mySocket: observable,
      poll: observable,
      ws: computed,
      postPoll: action,
      setListeners: action,
    });
  }
  get ws() {
    return this.mySocket.ws;
  }
  postPoll(poll: PollPost) {
    this.ws.send(
      JSON.stringify({
        type: ReqTypes.createPoll,
        payload: poll,
      })
    );
  }

  async setListeners() {
    try {
      if (!this.mySocket) throw "WebSocket conn has not been established";
      for await (const msg of this.mySocket) {
        if (!(msg instanceof MessageEvent)) {
          throw msg;
        }
        const data = JSON.parse(msg.data) as Payload;

        switch (data.type) {
          case RecTypes.pollInfo:
            // do something with created poll here
            this.poll = data.payload;
            break;
          default:
        }
      }
    } catch (r) {
      console.error(r);
    }
  }
}

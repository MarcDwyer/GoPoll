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
  subscribe = "subscribe",
  unsubscribe = "unsubscribe",
}

export enum RecTypes {
  pollInfo = "pollInfo",
  unsubscribe = "unsubscribe",
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
            const { pollInfo } = data.payload;
            if ("error" in pollInfo) {
              throw pollInfo;
            }
            this.poll = data.payload.pollInfo;
            break;
          case RecTypes.unsubscribe:
            console.log("Unsubed request compeleted");
            this.poll = null;
            break;
          default:
        }
      }
    } catch (r) {
      console.error(r);
    }
  }
  subscribe(id: string) {
    const payload = {
      type: ReqTypes.subscribe,
      payload: {
        id,
      },
    };
    this.ws.send(JSON.stringify(payload));
  }
  unsubscribe() {
    if (!this.poll) return;
    const payload = {
      type: ReqTypes.unsubscribe,
      payload: {
        id: this.poll.id,
      },
    };
    this.ws.send(JSON.stringify(payload));
  }
}

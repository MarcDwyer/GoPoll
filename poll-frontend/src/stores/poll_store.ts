import { action, computed, makeObservable, observable } from "mobx";
import { Deferred, deferred } from "../deferred";
import { PollPost } from "./create_poll_store";

type WebSocketEvent = MessageEvent<string>;

export class MySocket {
  private signal: Deferred<WebSocketEvent> = deferred();
  constructor(public ws: WebSocket) {}

  async *iterate() {
    while (true) {
      try {
        const msg = await this.signal;
        console.log(msg);
        yield msg;
        this.signal = deferred();
      } catch (e) {
        yield e;
        break;
      }
    }
  }

  handleEvents() {
    this.ws.onerror = (e) => this.signal.reject(`Conn error: ${e}`);
    this.ws.onmessage = (msg) => {
      console.log(`das msg: ${msg}`);
      this.signal.resolve(msg);
    };
  }
  [Symbol.asyncIterator](): AsyncIterableIterator<WebSocketEvent> {
    this.handleEvents();
    return this.iterate();
  }
}
export type Payload = {
  type: string;
  payload: any;
};
export enum Types {
  createPoll = "createPoll",
}

export class PollStore {
  mySocket: MySocket | null = null;
  constructor() {
    makeObservable(this, {
      mySocket: observable,
      ws: computed,
      postPoll: action,
    });
  }
  get ws() {
    return this.mySocket.ws;
  }
  postPoll(poll: PollPost) {
    this.ws.send(
      JSON.stringify({
        type: Types.createPoll,
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
        }
      }
    } catch (r) {
      console.error(r);
    }
  }
}

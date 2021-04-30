import { deferred, Deferred } from "./deferred";

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

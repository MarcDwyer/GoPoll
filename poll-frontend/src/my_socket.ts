import { deferred, Deferred } from "./deferred";

type WebSocketEvent = MessageEvent<string>;

export class MySocket {
  private signal: Deferred<WebSocketEvent> = deferred();
  constructor(public ws: WebSocket) {}

  private async *iterate() {
    while (true) {
      try {
        const msg = await this.signal;
        yield msg;
        this.signal = deferred();
      } catch (e) {
        yield e;
        break;
      }
    }
  }

  private handleEvents() {
    this.ws.onerror = (e) => this.signal.reject(`Conn error: ${e}`);
    this.ws.onmessage = (msg) => {
      this.signal.resolve(msg);
    };
  }
  [Symbol.asyncIterator](): AsyncIterableIterator<WebSocketEvent> {
    this.handleEvents();
    return this.iterate();
  }
}

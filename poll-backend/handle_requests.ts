import { Poll, ReqCreatePoll } from "./type_defs.ts";
import { v4 } from "https://deno.land/std@0.95.0/uuid/mod.ts";
import { PollRoom } from "./poll_room.ts";

export type PollRooms = Map<string, PollRoom>;

export class HandleRequest {
  pollRooms: PollRooms = new Map();

  createPoll(poll: ReqCreatePoll) {
    const options = poll.options.map((opt) => ({ count: 0, option: opt }));

    const id = v4.generate();
    const newPoll: Poll = {
      question: poll.question,
      options,
      id,
    };

    const pollRoom = new PollRoom(newPoll);
    this.pollRooms.set(id, pollRoom);
  }
}

import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { CreatePollStore } from "../../stores/create_poll_store";
import { PollStore } from "../../stores/poll_store";

import "./create_poll.scss";

interface InitProps {
  pollStore: PollStore;
}
interface FinalProps extends InitProps {
  createStore: CreatePollStore;
}
const CreatePoll = observer(({ createStore, pollStore }: FinalProps) => {
  const last = createStore.options[createStore.showing - 1];
  useEffect(() => {
    if (last && last.length) {
      createStore.showing++;
    }
  }, [last]);

  const sendPoll = () => {
    const isComp = createStore.isComplete;
    if (!isComp) return;
    const poll = createStore.finalize;
    pollStore.postPoll(poll);
  };
  return (
    <form
      className="create-poll card"
      onSubmit={(e) => {
        e.preventDefault();
        sendPoll();
      }}
    >
      <div className="inner-create">
        <span className="headline option">Create a poll!</span>
        <div className="question">
          <span className="option">Whats your question?</span>
          <input
            value={createStore.question}
            onChange={(e) => (createStore.question = e.target.value)}
            placeholder="Question"
          />
        </div>
        <div className="options headline">
          <span>Options</span>
          {createStore.options.map((opt, i) => {
            const { showing } = createStore;
            if (showing <= i) return;
            return (
              <input
                key={i}
                placeholder={`poll option ${i + 1}`}
                value={opt}
                onChange={(e) => {
                  createStore.options[i] = e.target.value;
                }}
              />
            );
          })}
        </div>
        <div className="buttons">
          <button className="submit btn" type="submit">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
});

export default (p: InitProps) => (
  <CreatePoll {...p} createStore={new CreatePollStore()} />
);

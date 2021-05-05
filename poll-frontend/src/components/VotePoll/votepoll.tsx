import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useParams } from "react-router";
import { PollStore } from "../../stores/poll_store";

type Props = {
  pollStore: PollStore;
};
export const VotePoll = observer(({ pollStore }: Props) => {
  const { poll } = pollStore;
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!poll && id && id.length) {
      // fetch poll here
      pollStore.subscribe(id);
    }
  }, [poll]);
  return (
    <div className="vote card">{poll && <span>{poll.question}</span>}</div>
  );
});

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
      console.log(id);
    }
  }, [poll]);
  return <div className="vote card"></div>;
});

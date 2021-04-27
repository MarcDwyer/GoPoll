import { observer } from "mobx-react-lite";
import React from "react";
import CreatePoll from "../../components/CreatePoll/create_poll";
import { PollStore } from "../../stores/poll_store";

type Props = {
  pollStore: PollStore;
};

export const Homepage = observer(({ pollStore }: Props) => {
  return (
    <div className="container homepage">
      <CreatePoll pollStore={pollStore} />
    </div>
  );
});

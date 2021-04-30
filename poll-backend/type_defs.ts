export type PollOption = {
  count: number;
  option: string;
};
export type Poll = {
  question: string;
  id: string;
  options: PollOption[];
};

export type ReqCreatePoll = {
  question: string;
  options: string[];
};

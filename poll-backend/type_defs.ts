export type PollOption = {
  count: number;
  option: string;
};
export type Poll = {
  question: string;
  options: PollOption[];
};

export type WebSocketRequest = {
  type: string;
  payload: any;
};

export enum Types {
  createGame = "create_game",
}

export type PollOption = {
  count: number;
  option: string;
};
export type Poll = {
  question: string;
  id: string;
  options: PollOption[];
};

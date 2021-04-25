export type WebSocketRequest = {
  type: string;
  payload: any;
};

export enum Types {
  createGame = "create_game",
}

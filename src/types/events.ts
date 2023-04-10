import { ClientEvents, Awaitable, Client } from "discord.js";

type ILoggerFunction = (...args: unknown[]) => void;

export interface IEventProps {
  client: Client;
  log: ILoggerFunction;
}

export type IEventKeys = keyof ClientEvents;
export type IEventExec<T extends IEventKeys> = (
  props: IEventProps,
  ...args: ClientEvents[T]
) => Awaitable<unknown>;
export interface IEvent<T extends IEventKeys> {
  id: T;
  exec: IEventExec<T>;
}

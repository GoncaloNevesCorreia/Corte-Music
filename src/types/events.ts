import {
  ClientEvents,
  Awaitable,
  Client,
  ButtonInteraction,
  CacheType,
  StringSelectMenuInteraction,
} from "discord.js";
import interactions from "../events/interactionCreate/interactions";

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

export interface IButtonInteractionProps {
  client: Client;
  interaction: ButtonInteraction<CacheType>;
  namespace: string;
  log: ILoggerFunction;
}

export interface ISelectInteractionProps {
  client: Client;
  interaction: StringSelectMenuInteraction<CacheType>;
  namespace: string;
  log: ILoggerFunction;
}

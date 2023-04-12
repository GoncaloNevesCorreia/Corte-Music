import {
  Awaitable,
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  APIMessageComponentEmoji,
} from "discord.js";

type ILoggerFunction = (...args: unknown[]) => void;

export interface ICommandProps {
  interaction: ChatInputCommandInteraction;
  client: Client;
  log: ILoggerFunction;
}

export type ICommandExec = (props: ICommandProps) => Awaitable<unknown>;

export type ICommandMeta =
  | SlashCommandBuilder
  | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

export interface ICommand {
  meta: ICommandMeta;
  exec: ICommandExec;
}

export interface ICommandCategoryExtra {
  description?: string;
  emoji?: APIMessageComponentEmoji;
}

export interface ICommandCategory extends ICommandCategoryExtra {
  name: string;
  commands: ICommand[];
}

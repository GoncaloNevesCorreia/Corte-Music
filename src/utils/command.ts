import {
  ICommand,
  ICommandCategory,
  ICommandCategoryExtra,
  ICommandExec,
  ICommandMeta,
} from "../types";

export function command(meta: ICommandMeta, exec: ICommandExec): ICommand {
  return {
    meta,
    exec,
  };
}

export function category(
  name: string,
  commands: ICommand[],
  extra: ICommandCategoryExtra = {}
): ICommandCategory {
  return {
    name,
    commands,
    ...extra,
  };
}

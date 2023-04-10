import { IEvent, IEventExec, IEventKeys } from "../types";
import { Client } from "discord.js";

export function event<T extends IEventKeys>(
  id: T,
  exec: IEventExec<T>
): IEvent<T> {
  return {
    id,
    exec,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerEvents(client: Client, events: IEvent<any>[]): void {
  for (const event of events) {
    client.on(event.id, async (...args) => {
      // Create Props
      const props = {
        client,
        log: (...args: unknown[]) => console.log(`[${event.id}]`, ...args),
      };

      // Catch Uncaught Errors
      try {
        await event.exec(props, ...args);
      } catch (error) {
        props.log("Uncaught Error", error);
      }
    });
  }
}

// event.exec.bind(null, {
//   client,
//   log: (...args) => console.log(`[${event.id}]`, ...args),
// })

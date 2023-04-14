import { IEvent } from "../types";
import interactionCreate from "./interactionCreate";
import ready from "./ready";
import message from "./message";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const events: IEvent<any>[] = [ready, message, ...interactionCreate];

export default events;

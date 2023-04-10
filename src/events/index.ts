import { IEvent } from "../types";
import interactionCreate from "./interactionCreate";
import ready from "./ready";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const events: IEvent<any>[] = [ready, ...interactionCreate];

export default events;

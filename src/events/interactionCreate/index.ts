import { IEvent } from "../../types";
import commands from "./commands";
import interactions from "./interactions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const events: IEvent<any>[] = [commands, interactions];

export default events;

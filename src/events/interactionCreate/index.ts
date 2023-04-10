import { IEvent } from "../../types";
import commands from "./commands";
import help from "./help";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const events: IEvent<any>[] = [commands, help];

export default events;

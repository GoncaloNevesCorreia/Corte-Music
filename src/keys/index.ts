import { IKeys } from "../types";

const NOT_FOUND = "nil";

const keys: IKeys = {
  clientToken: process.env.CLIENT_TOKEN ?? NOT_FOUND,
  testGuild: process.env.TEST_GUILD ?? NOT_FOUND,
};

if (Object.values(keys).includes(NOT_FOUND))
  throw new Error(`Missing environment variables...`);

export default keys;

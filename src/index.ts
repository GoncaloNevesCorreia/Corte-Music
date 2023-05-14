console.clear();

import { config } from "dotenv";
import { join } from "path";
import { existsSync } from "fs";

const path1 = join(__dirname, ".env");
const path2 = join(__dirname, "..", ".env");

if (existsSync(path1)) {
  config({ path: path1 });
} else if (existsSync(path2)) {
  config({ path: path2 });
} else {
  throw new Error("Missing .env file");
}

import "./config/client";

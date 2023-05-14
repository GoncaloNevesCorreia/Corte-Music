/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const { build } = require("esbuild");

const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { readFileSync, copyFileSync, existsSync } = require("fs");
const path = require("path");

const bundleDirName = "bundle";
const commandSeparator = "&&";

(async () => {
  console.clear();
  await createBundle();
  await delay(3000);
  await setUpBundledProjectEnvironment();
  console.log("Done.");
})();

async function createBundle() {
  console.log("Building...");
  await exec("npm run build");
  await delay(3000);
  console.log("Bundling...");
  build({
    entryPoints: ["build/index.js"],
    outfile: "bundle/index.js",
    mainFields: ["module", "main"],
    bundle: true,
    platform: "node",
    target: "node18",
    legalComments: "none",
  }).catch(() => process.exit(1));
  await exec("rimraf ./build");
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function setUpBundledProjectEnvironment() {
  console.log("Setting up environment...");
  console.log("Installing Dependencies...");

  const commands = [
    `cd ${bundleDirName}`,
    `npm init -y`,
    `npm install ${getDependencies()}`,
  ];

  await exec(commands.join(` ${commandSeparator} `));

  console.log("Adding .env file...");
  moveEnvToProject();
  console.log("Adding FFMPEG...");
  moveFFMPEG();
}

function moveEnvToProject() {
  const srcPath = path.join(__dirname, ".env");
  const destPath = path.join(__dirname, bundleDirName, ".env");

  if (!existsSync(srcPath)) {
    throw new Error("Missing the .env file in the project...");
  }

  copyFileSync(srcPath, destPath);
}

function moveFFMPEG() {
  const srcPath = path.join(
    __dirname,
    "node_modules",
    "ffmpeg-static",
    "ffmpeg.exe"
  );

  const destPath = path.join(__dirname, bundleDirName, "ffmpeg.exe");

  if (!existsSync(srcPath)) {
    throw new Error("Package ffmpeg-static is missing");
  }

  copyFileSync(srcPath, destPath);
}

function getDependencies() {
  const package = readFileSync("package.json", "utf8");
  const packageJson = JSON.parse(package);
  const dependencies = Object.keys(packageJson.dependencies);
  return dependencies.join(" ");
}

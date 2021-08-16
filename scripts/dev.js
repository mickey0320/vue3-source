const fs = require("fs");
const execa = require("execa");

async function build(dir) {
  await execa("rollup", ["-cw", "--environment", `TARGET:${dir}`], {
    stdio: "inherit",
  });
}

build("reactivity");

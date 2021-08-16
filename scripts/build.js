const fs = require("fs");
const execa = require("execa");

const dirs = fs.readdirSync("packages").filter((p) => {
  if (fs.statSync(`packages/${p}`).isDirectory()) {
    return true;
  }
  return false;
});

async function build(dir) {
  await execa("rollup", ["-c", "--environment", `TARGET:${dir}`], {
    stdio: "inherit",
  });
}

async function runParallel(dirs, iteratorFn) {
  const result = [];
  for (let dir of dirs) {
    result.push(iteratorFn(dir));
  }

  return Promise.all(result);
}

runParallel(dirs, build);

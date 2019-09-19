#!/usr/bin/env node
const path = require("path");
const program = require("commander");
const h = require("../lib/helper");
const tasks = require("../lib/tasks");
const operates = require("../lib/operates");

program
  .version(require("../package.json").version)
  .usage("<command> [options]");

program
  .command("deploy <path>")
  .description("deployment")
  .action(configPath => {
    const config = require(path.resolve(process.cwd(), configPath));
    start(config);
  });

program
  .command("rollback <path>")
  .description("back to the specified version")
  .action(configPath => {
    const config = require(path.resolve(process.cwd(), configPath));
    rollback(config);
  });

program.parse(process.argv);

if (process.argv.length === 2) {
  program.outputHelp();
}

async function start(config) {
  try {
    config = await tasks.getConfig(config, operates.DEPLOY);
    const startTime = Date.now();

    !config.local && await tasks.fetchSource(config);
    await tasks.build(config);
    await tasks.pack(config);
    await tasks.deloy(config);
    !config.local && await tasks.cleanWorkspace(config);

    h.log.done(`Deployed successfully in ${(Date.now() - startTime) / 1000}s.`);
  } catch (err) {
    h.log.plain(err);
  }
}

async function rollback(config) {
  try {
    config = await tasks.getConfig(config, operates.ROLLBACK);
    const startTime = Date.now();

    await tasks.rollback(config);
    h.log.done(
      `Rollbacked successfully in ${(Date.now() - startTime) / 1000}s.`
    );
  } catch (err) {
    h.log.plain(err);
  }
}

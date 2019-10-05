#!/usr/bin/env node

import * as path from 'path'
import * as program from 'commander'
import helper from './helper'
import tasks from './tasks'

import { DeploymentConfig, Tasks } from './types'

program.version(require('../package.json').version)
program.option('-C, --config <path>', 'configuration file path')
program.parse(process.argv)

if (process.argv.length === 2) {
  program.outputHelp()
} else {
  if (program.config) {
    start(configFor(program.config))
  } else {
    helper.log.plain(`error: option '-C, --config <path>' missing`)
  }
}

async function start(config: DeploymentConfig): Promise<void> {
  try {
    const st = Date.now()
    const taskNames = tasksFor(config)

    for (let i = 0; i < taskNames.length; i++) {
      await tasks[taskNames[i] as keyof Tasks](config)
    }

    helper.log.done(
      `Deployed successfully in ${Math.round((Date.now() - st) / 1000)}s.`
    )
  } catch (err) {
    helper.log.plain(err)
  }
}

function configFor(configPath: string): DeploymentConfig {
  return require(path.resolve(process.cwd(), configPath))
}

function tasksFor(config: DeploymentConfig): string[] {
  const tasks = ['processConfig', 'build', 'pack', 'deloy', 'clear']

  if (!config.repository.local) {
    tasks.splice(1, 0, 'fetchSource')
  }

  return tasks
}

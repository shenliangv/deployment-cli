import * as path from 'path'
import * as inquirer from 'inquirer'
import del from 'del'
import questions from './questions'
import helper from './helper'

import { DeploymentConfig, Tasks } from './types'

function remoteShellCommands(config: DeploymentConfig): string[] {
  const result = []

  result.push(`cd ${config.remoteOperatesConfig.remotePath}`)

  if (config.remoteOperatesConfig.clean) {
    config.buildConfig.assetsPatterns.forEach(item => {
      result.push(`rm -rf ${item}`)
    })
  }

  result.push(`unzip -o ${config.packConfig.packedFilename}`)
  result.push(`rm -rf ${config.packConfig.packedFilename}`)
  result.push(`exit\n`)

  return result
}

async function build(config: DeploymentConfig): Promise<boolean> {
  try {
    const { commands } = config.buildConfig
    const { sourceDir } = config.packConfig

    for (let i = 0; i < commands.length; i++) {
      await helper.execLocalShell(commands[i], { cwd: sourceDir })
    }

    return true
  } catch (err) {
    throw err
  }
}

async function clear(config: DeploymentConfig): Promise<boolean> {
  try {
    helper.log.info('Clear workspace...')

    await del(config.packConfig.packedFilePath)

    if (!config.repository.local) {
      await del(config.packConfig.sourceDir)
    }

    return true
  } catch (err) {
    throw err
  }
}

async function deloy(config: DeploymentConfig): Promise<boolean> {
  try {
    const { packedFilename, packedFilePath } = config.packConfig
    const { remotePath, commands } = config.remoteOperatesConfig
    const conn = await helper.getConnection(config.connectConfig)
    const sftp = await helper.getSftp(conn)

    await helper.putFile(
      sftp,
      packedFilePath,
      `${remotePath}/${packedFilename}`
    )

    await helper.readFile(sftp, `${remotePath}/${packedFilename}`)
    await helper.execRemoteShell(conn, commands.join('\n'))

    conn.end()

    return true
  } catch (err) {
    throw err
  }
}

async function fetchSource(config: DeploymentConfig): Promise<boolean> {
  try {
    const { branch, tag, url } = config.repository
    const { sourceDir } = config.packConfig

    await del(sourceDir)
    await helper.execLocalShell(`git clone ${url} ${sourceDir}`, {
      cwd: process.cwd()
    })

    if (branch && !tag) {
      await helper.execLocalShell(`git checkout ${branch}`, { cwd: sourceDir })
    }

    if (tag) {
      await helper.execLocalShell(`git checkout ${tag}`, { cwd: sourceDir })
    }

    return true
  } catch (err) {
    throw err
  }
}

async function pack(config: DeploymentConfig): Promise<boolean> {
  try {
    const { outputDir } = config.buildConfig
    const { packedFilePath, sourceDir } = config.packConfig

    await helper.compress(path.resolve(sourceDir, outputDir), packedFilePath)

    return true
  } catch (err) {
    throw err
  }
}

async function processConfig(
  config: DeploymentConfig
): Promise<DeploymentConfig> {
  try {
    const answer = await inquirer.prompt(questions)
  
    const { clean, tag } = answer
    const packedFilename = '__TEMP__.zip'
    const sourceDir = !config.repository.local
      ? path.resolve(process.cwd(), '__TEMP__')
      : process.cwd()

    config.repository = Object.assign({}, config.repository, { tag })
  
    config.packConfig = Object.assign({}, config.packConfig, {
      sourceDir,
      packedFilename,
      packedFilePath: path.resolve(process.cwd(), packedFilename)
    })

    config.remoteOperatesConfig = Object.assign(
      {},
      config.remoteOperatesConfig,
      { clean }
    )
  
    config.remoteOperatesConfig.commands = remoteShellCommands(config)

    helper.log.info('The configuration is:')
    helper.log.plain(JSON.stringify(config, null, 2))

    return config
  } catch (err) {
    throw err
  }
}

const tasks: Tasks = {
  build,
  clear,
  deloy,
  fetchSource,
  processConfig,
  pack
}

export default tasks

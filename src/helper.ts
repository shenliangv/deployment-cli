import * as fs from 'fs'
import * as archiver from 'archiver'
import { exec } from 'child_process'
import { Client as sshClient } from 'ssh2'
import chalk from 'chalk'

import { ExecOptions } from 'child_process'
import { Client, ConnectConfig, SFTPWrapper } from 'ssh2'
import { Archiver } from 'archiver'
import { Chalk } from 'chalk'

const log = {
  plain: (msg: string, color?: keyof Chalk): void => {
    console.log(color ? (chalk[color] as Chalk)(msg) : msg)
  },
  info: (msg: string): void =>
    console.log(chalk`\n{bgCyan.black  INFO } {cyan ${msg}}\n`),
  done: (msg: string): void =>
    console.log(chalk`\n{bgGreen.black  DONE } {green ${msg}\n}`)
}

function compress(sourceDir: string, outputPath: string): Promise<boolean> {
  log.info('Compress source file...')

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath)
    const archive: Archiver = archiver('zip', { forceLocalTime: true })

    archive.on('warning', err => reject(err))
    archive.on('error', err => reject(err))
    output.on('finish', () => {
      log.plain((archive.pointer() / 1024 / 1024).toFixed(2) + ' total MB')
      log.plain(
        'Archiver has been finalized and the output file descriptor has closed.'
      )
      resolve(true)
    })

    archive.pipe(output)
    archive.directory(sourceDir, '/')
    archive.finalize()
  })
}

function execLocalShell(
  command: string,
  options: ExecOptions
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    log.info('Execute local shell command...')
    log.plain(command, 'yellow')

    exec(command, options, (err, stdout) => {
      if (err) {
        reject(err)
      } else {
        stdout && log.plain(stdout)
        resolve(true)
      }
    })
  })
}

function execRemoteShell(conn: Client, command: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    log.info('Execute remote shell command...')
    log.plain(command, 'yellow')

    conn.shell((err, stream) => {
      if (err) reject(err)

      stream
        .on('close', () => {
          log.plain('Commands has been executed.')
          resolve(true)
        })
        .on('data', () => {})
        .end(command)
    })
  })
}

function getConnection(config: ConnectConfig): Promise<Client> {
  return new Promise((resolve, reject) => {
    const conn = new sshClient()

    conn
      .on('ready', () => resolve(conn))
      .on('error', err => reject(err))
      .connect(config)
  })
}

function getSftp(conn: Client): Promise<SFTPWrapper> {
  return new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      err ? reject(err) : resolve(sftp)
    })
  })
}

function putFile(
  sftp: SFTPWrapper,
  localPath: string,
  remotePath: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    sftp.fastPut(localPath, remotePath, err => {
      log.info('File uploading...')

      if (err) {
        reject(err)
      } else {
        log.plain('File uploaded.')
        resolve(true)
      }
    })
  })
}

function readFile(sftp: SFTPWrapper, path: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    sftp.readFile(path, (err, list) => {
      err ? reject(err) : resolve(list)
    })
  })
}

export default {
  compress,
  execLocalShell,
  execRemoteShell,
  getConnection,
  getSftp,
  log,
  putFile,
  readFile
}

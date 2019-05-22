const fs = require("fs");
const { exec } = require("child_process");
const archiver = require("archiver");
const chalk = require("chalk");
const Client = require("ssh2").Client;

const log = {
  plain: (msg, color) => {
    console.log(color ? chalk[color](msg) : msg);
  },
  info: msg => console.log(chalk`\n{bgCyan.black  INFO } {cyan ${msg}}\n`),
  done: msg => console.log(chalk`\n{bgGreen.black  DONE } {green ${msg}\n}`)
};

function compress(sourcePath, outputPath) {
  log.info("Compress source file...");

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver("zip", { forceLocalTime: true });

    archive.on("warning", err => reject(err));
    archive.on("error", err => reject(err));
    output.on("finish", () => {
      log.plain((archive.pointer() / 1024 / 1024).toFixed(2) + " total MB");
      log.plain(
        "Archiver has been finalized and the output file descriptor has closed."
      );
      resolve();
    });

    archive.pipe(output);
    archive.directory(sourcePath, "/");
    archive.finalize();
  });
}

function execLocalShell(command, options) {
  return new Promise((resolve, reject) => {
    log.info("Execute local shell command...");
    log.plain(command, "yellow");

    exec(command, options, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        stdout && log.plain(stdout);
        resolve();
      }
    });
  });
}

function execRemoteShell(conn, command) {
  return new Promise((resolve, reject) => {
    log.info("Execute remote shell command...");
    log.plain(command, "yellow");

    conn.shell((err, stream) => {
      if (err) reject(err);

      stream
        .on("close", () => {
          log.plain("Commands has been executed.");
          resolve();
        })
        .on("data", () => {})
        .end(command);
    });
  });
}

function getConnection(server) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on("ready", () => resolve(conn))
      .on("error", err => reject(err))
      .connect(server);
  });
}

function getSftp(conn) {
  return new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      err ? reject(err) : resolve(sftp);
    });
  });
}

function putFile(sftp, localPath, remotePath) {
  return new Promise((resolve, reject) => {
    sftp.fastPut(localPath, remotePath, err => {
      log.info("File uploading...");

      if (err) {
        reject(err);
      } else {
        log.plain("File uploaded.");
        resolve();
      }
    });
  });
}

function readFile(sftp, path) {
  return new Promise((resolve, reject) => {
    sftp.readFile(path, (err, list) => {
      err ? reject(err) : resolve(list);
    });
  });
}

module.exports = {
  compress: compress,
  execLocalShell: execLocalShell,
  execRemoteShell: execRemoteShell,
  getConnection: getConnection,
  getSftp: getSftp,
  log: log,
  putFile: putFile,
  readFile: readFile
};

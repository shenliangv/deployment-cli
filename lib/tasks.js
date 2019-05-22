const path = require("path");
const del = require("del");
const inquirer = require("inquirer");
const questions = require("./questions");
const h = require("./helper");

async function build(config) {
  try {
    const { buildCommands, sourcePath } = config;

    for (let i = 0; i < buildCommands.length; i++) {
      const command = buildCommands[i];
      await h.execLocalShell(command, { cwd: sourcePath });
    }

    return true;
  } catch (err) {
    throw err;
  }
}

async function cleanWorkspace(config) {
  try {
    h.log.info("Clean workspace...");
    await del(config.packedFilePath);
    await del(config.sourcePath);

    return true;
  } catch (err) {
    throw err;
  }
}

async function deloy(config) {
  try {
    const {
      packedFilename,
      packedFilePath,
      remotePath,
      remoteShellCommands,
      server
    } = config;
    const conn = await h.getConnection(server);
    const sftp = await h.getSftp(conn);

    await h.putFile(sftp, packedFilePath, `${remotePath}/${packedFilename}`);
    // 验证是否文件是否存在
    await h.readFile(sftp, `${remotePath}/${packedFilename}`);
    await h.execRemoteShell(conn, remoteShellCommands);
    conn.end();

    return true;
  } catch (err) {
    throw err;
  }
}

async function fetchSource(config) {
  try {
    const { url, branch, tag } = config.repository;
    const sourcePath = config.sourcePath;

    await del(sourcePath);
    await h.execLocalShell(`git clone ${url}`, { cwd: process.cwd() });
    await h.execLocalShell(`git checkout ${branch}`, { cwd: sourcePath });
    tag && (await h.execLocalShell(`git checkout ${tag}`, { cwd: sourcePath }));

    return true;
  } catch (err) {
    throw err;
  }
}

async function getConfig(config, operate) {
  try {
    const answer = await inquirer.prompt(questions[operate]);
    const { version, backup, tag } = answer;

    config.version = version;
    config.backup = backup;
    config.sourcePath = path.resolve(process.cwd(), config.repository.name);
    config.packedFilename = `${version}.zip`; // zip压缩后的文件名
    config.remoteShellCommands = _getDeployShellCommands(config, operate);
    // 压缩文件路径
    config.packedFilePath = path.resolve(process.cwd(), config.packedFilename);
    config.repository.tag = tag;

    h.log.plain(JSON.stringify(config, null, 2));
    return config;
  } catch (err) {
    throw err;
  }
}

async function pack(config) {
  try {
    const { buildOutputPath, packedFilePath, sourcePath } = config;

    // zip压缩
    await h.compress(path.resolve(sourcePath, buildOutputPath), packedFilePath);

    return true;
  } catch (err) {
    throw err;
  }
}

async function rollback(config) {
  try {
    const { packedFilename, remotePath, remoteShellCommands, server } = config;
    const conn = await h.getConnection(server);
    const sftp = await h.getSftp(conn);

    // 验证是否文件是否存在
    await h.readFile(sftp, `${remotePath}/${packedFilename}`);
    await h.execRemoteShell(conn, remoteShellCommands);
    conn.end();
    return true;
  } catch (err) {
    throw err;
  }
}

function _getDeployShellCommands(config, operate) {
  const commands = [];
  const { remotePath, sourcePatterns, packedFilename, backup } = config;

  // 进入部署目录
  commands.push(`cd ${remotePath}\n`);

  // 删除原有的源代码文件
  sourcePatterns.forEach(item => commands.push(`rm -rf ${item}\n`));

  // 解压缩上传的源代码文件
  commands.push(`unzip -o ${packedFilename}\n`);

  // 删除上传的源代码文件
  if (operate === "DEPLOY" && !backup) {
    commands.push(`rm -rf ${packedFilename}\n`);
  }

  commands.push(`exit\n`);

  return commands.join("");
}

module.exports = {
  build: build,
  cleanWorkspace: cleanWorkspace,
  deloy: deloy,
  fetchSource: fetchSource,
  getConfig: getConfig,
  pack: pack,
  rollback: rollback
};

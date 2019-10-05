"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var archiver = require("archiver");
var child_process_1 = require("child_process");
var ssh2_1 = require("ssh2");
var chalk_1 = require("chalk");
var log = {
    plain: function (msg, color) {
        console.log(color ? chalk_1.default[color](msg) : msg);
    },
    info: function (msg) {
        return console.log(chalk_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n{bgCyan.black  INFO } {cyan ", "}\n"], ["\\n{bgCyan.black  INFO } {cyan ", "}\\n"])), msg));
    },
    done: function (msg) {
        return console.log(chalk_1.default(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n{bgGreen.black  DONE } {green ", "\n}"], ["\\n{bgGreen.black  DONE } {green ", "\\n}"])), msg));
    }
};
function compress(sourceDir, outputPath) {
    log.info('Compress source file...');
    return new Promise(function (resolve, reject) {
        var output = fs.createWriteStream(outputPath);
        var archive = archiver('zip', { forceLocalTime: true });
        archive.on('warning', function (err) { return reject(err); });
        archive.on('error', function (err) { return reject(err); });
        output.on('finish', function () {
            log.plain((archive.pointer() / 1024 / 1024).toFixed(2) + ' total MB');
            log.plain('Archiver has been finalized and the output file descriptor has closed.');
            resolve(true);
        });
        archive.pipe(output);
        archive.directory(sourceDir, '/');
        archive.finalize();
    });
}
function execLocalShell(command, options) {
    return new Promise(function (resolve, reject) {
        log.info('Execute local shell command...');
        log.plain(command, 'yellow');
        child_process_1.exec(command, options, function (err, stdout) {
            if (err) {
                reject(err);
            }
            else {
                stdout && log.plain(stdout);
                resolve(true);
            }
        });
    });
}
function execRemoteShell(conn, command) {
    return new Promise(function (resolve, reject) {
        log.info('Execute remote shell command...');
        log.plain(command, 'yellow');
        conn.shell(function (err, stream) {
            if (err)
                reject(err);
            stream
                .on('close', function () {
                log.plain('Commands has been executed.');
                resolve(true);
            })
                .on('data', function () { })
                .end(command);
        });
    });
}
function getConnection(config) {
    return new Promise(function (resolve, reject) {
        var conn = new ssh2_1.Client();
        conn
            .on('ready', function () { return resolve(conn); })
            .on('error', function (err) { return reject(err); })
            .connect(config);
    });
}
function getSftp(conn) {
    return new Promise(function (resolve, reject) {
        conn.sftp(function (err, sftp) {
            err ? reject(err) : resolve(sftp);
        });
    });
}
function putFile(sftp, localPath, remotePath) {
    return new Promise(function (resolve, reject) {
        sftp.fastPut(localPath, remotePath, function (err) {
            log.info('File uploading...');
            if (err) {
                reject(err);
            }
            else {
                log.plain('File uploaded.');
                resolve(true);
            }
        });
    });
}
function readFile(sftp, path) {
    return new Promise(function (resolve, reject) {
        sftp.readFile(path, function (err, list) {
            err ? reject(err) : resolve(list);
        });
    });
}
exports.default = {
    compress: compress,
    execLocalShell: execLocalShell,
    execRemoteShell: execRemoteShell,
    getConnection: getConnection,
    getSftp: getSftp,
    log: log,
    putFile: putFile,
    readFile: readFile
};
var templateObject_1, templateObject_2;

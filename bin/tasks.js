"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var inquirer = require("inquirer");
var del_1 = require("del");
var questions_1 = require("./questions");
var helper_1 = require("./helper");
function remoteShellCommands(config) {
    var result = [];
    result.push("cd " + config.remoteOperatesConfig.remotePath);
    if (config.remoteOperatesConfig.clean) {
        config.buildConfig.assetsPatterns.forEach(function (item) {
            result.push("rm -rf " + item);
        });
    }
    result.push("unzip -o " + config.packConfig.packedFilename);
    result.push("rm -rf " + config.packConfig.packedFilename);
    result.push("exit\n");
    return result;
}
function build(config) {
    return __awaiter(this, void 0, void 0, function () {
        var commands, sourceDir, i, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    commands = config.buildConfig.commands;
                    sourceDir = config.packConfig.sourceDir;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < commands.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, helper_1.default.execLocalShell(commands[i], { cwd: sourceDir })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, true];
                case 5:
                    err_1 = _a.sent();
                    throw err_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function clear(config) {
    return __awaiter(this, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    helper_1.default.log.info('Clear workspace...');
                    return [4 /*yield*/, del_1.default(config.packConfig.packedFilePath)];
                case 1:
                    _a.sent();
                    if (!!config.repository.local) return [3 /*break*/, 3];
                    return [4 /*yield*/, del_1.default(config.packConfig.sourceDir)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, true];
                case 4:
                    err_2 = _a.sent();
                    throw err_2;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function deloy(config) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, packedFilename, packedFilePath, _b, remotePath, commands, conn, sftp, err_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, , 7]);
                    _a = config.packConfig, packedFilename = _a.packedFilename, packedFilePath = _a.packedFilePath;
                    _b = config.remoteOperatesConfig, remotePath = _b.remotePath, commands = _b.commands;
                    return [4 /*yield*/, helper_1.default.getConnection(config.connectConfig)];
                case 1:
                    conn = _c.sent();
                    return [4 /*yield*/, helper_1.default.getSftp(conn)];
                case 2:
                    sftp = _c.sent();
                    return [4 /*yield*/, helper_1.default.putFile(sftp, packedFilePath, remotePath + "/" + packedFilename)];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, helper_1.default.readFile(sftp, remotePath + "/" + packedFilename)];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, helper_1.default.execRemoteShell(conn, commands.join('\n'))];
                case 5:
                    _c.sent();
                    conn.end();
                    return [2 /*return*/, true];
                case 6:
                    err_3 = _c.sent();
                    throw err_3;
                case 7: return [2 /*return*/];
            }
        });
    });
}
function fetchSource(config) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, branch, tag, url, sourceDir, err_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    _a = config.repository, branch = _a.branch, tag = _a.tag, url = _a.url;
                    sourceDir = config.packConfig.sourceDir;
                    return [4 /*yield*/, del_1.default(sourceDir)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, helper_1.default.execLocalShell("git clone " + url + " " + sourceDir, {
                            cwd: process.cwd()
                        })];
                case 2:
                    _b.sent();
                    if (!(branch && !tag)) return [3 /*break*/, 4];
                    return [4 /*yield*/, helper_1.default.execLocalShell("git checkout " + branch, { cwd: sourceDir })];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    if (!tag) return [3 /*break*/, 6];
                    return [4 /*yield*/, helper_1.default.execLocalShell("git checkout " + tag, { cwd: sourceDir })];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6: return [2 /*return*/, true];
                case 7:
                    err_4 = _b.sent();
                    throw err_4;
                case 8: return [2 /*return*/];
            }
        });
    });
}
function pack(config) {
    return __awaiter(this, void 0, void 0, function () {
        var outputDir, _a, packedFilePath, sourceDir, err_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    outputDir = config.buildConfig.outputDir;
                    _a = config.packConfig, packedFilePath = _a.packedFilePath, sourceDir = _a.sourceDir;
                    return [4 /*yield*/, helper_1.default.compress(path.resolve(sourceDir, outputDir), packedFilePath)];
                case 1:
                    _b.sent();
                    return [2 /*return*/, true];
                case 2:
                    err_5 = _b.sent();
                    throw err_5;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function processConfig(config) {
    return __awaiter(this, void 0, void 0, function () {
        var answer, clean, tag, packedFilename, sourceDir, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, inquirer.prompt(questions_1.default)];
                case 1:
                    answer = _a.sent();
                    clean = answer.clean, tag = answer.tag;
                    packedFilename = '__TEMP__.zip';
                    sourceDir = !config.repository.local
                        ? path.resolve(process.cwd(), '__TEMP__')
                        : process.cwd();
                    config.repository = Object.assign({}, config.repository, { tag: tag });
                    config.packConfig = Object.assign({}, config.packConfig, {
                        sourceDir: sourceDir,
                        packedFilename: packedFilename,
                        packedFilePath: path.resolve(process.cwd(), packedFilename)
                    });
                    config.remoteOperatesConfig = Object.assign({}, config.remoteOperatesConfig, { clean: clean });
                    config.remoteOperatesConfig.commands = remoteShellCommands(config);
                    helper_1.default.log.info('The configuration is:');
                    helper_1.default.log.plain(JSON.stringify(config, null, 2));
                    return [2 /*return*/, config];
                case 2:
                    err_6 = _a.sent();
                    throw err_6;
                case 3: return [2 /*return*/];
            }
        });
    });
}
var tasks = {
    build: build,
    clear: clear,
    deloy: deloy,
    fetchSource: fetchSource,
    processConfig: processConfig,
    pack: pack
};
exports.default = tasks;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deployQuestions = [
    { type: 'input', name: 'tag', message: 'git tag(press enter to skip):' },
    {
        type: 'confirm',
        name: 'clean',
        message: 'clear the original deployed files?',
        default: false
    }
];
exports.default = deployQuestions;

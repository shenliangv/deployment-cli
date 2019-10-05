A frontend deployment tool base on [ssh2](https://github.com/mscdex/ssh2)

## Getting Started

```sh
npm i -D deployment-cli

npx deployment-cli --config "path/to/configuration/file"
```

or

```sh
npm i -g deployment-cli

deployment-cli --config "path/to/configuration/file"
```

## Usage

```sh
deployment-cli [options]

Options:
  -V, --version        output the version number
  -C, --config <path>  configuration file path
  -h, --help           output usage information
```

## Configuration file

```js
// example deploy.config.js
module.exports = {
  repository: {
    // local: true,
    type: 'git',
    url: 'https://git.dev.tencent.com/cyxuan0926/prison-web.git',
    branch: 'master'
  },

  buildConfig: {
    commands: ['npm ci', 'npm run build:test'],
    outputDir: 'dist',
    assetsPatterns: ['static', 'index.html']
  },

  remoteOperatesConfig: {
    remotePath: '/root/deployment-cli-test'
  },

  connectConfig: {
    host: '192.168.0.114',
    port: 22,
    username: 'root',
    password: '123456',
    // privateKey: require('fs').readFileSync('/here/is/my/key')
  }
}
```

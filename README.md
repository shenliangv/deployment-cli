A frontend deployment tool base on [ssh2](https://github.com/mscdex/ssh2)

## Getting Started
```
npm i -D deployment-cli

# deploy
npx deployment-cli deploy "path/to/config/file"

# rollback
npx deployment-cli rollback "path/to/config/file"
```
or
```
npm i -g deployment-cli

# deploy
deployment-cli deploy "path/to/config/file"

# rollback
deployment-cli rollback "path/to/config/file"
```


## Usage
```
Usage: deployment-cli <command> [options]

Options:
  -V, --version    output the version number
  -h, --help       output usage information

Commands:
  deploy <path>    deployment
  rollback <path>  back to the specified version
```

## Configuration file
```js
// deploy.config.js
module.exports = {
  buildCommands: ["npm install", "npm run build:test"],
  buildOutputPath: "dist",
  repository: {
    name: "project-name",
    branch: "master",
    url: "https://github.com/username/project-name.git"
  },
  remotePath: "/mnt/projects/nginx/www",
  sourcePatterns: ["static", "index.html"],
  server: {
    host: "192.168.0.42",
    port: 22,
    username: "root",
    password: "asdfasdf15165"
  }
};
```

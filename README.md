A front end deployment tool base on ssh2

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
  rollback <path>  Back to the specified version
```

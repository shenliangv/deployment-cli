import { ConnectConfig } from 'ssh2'

export type RepositoryType = 'GIT' | 'SVN'

export interface RepositoryConfig {
  local?: boolean
  type: RepositoryType
  url: string
  branch?: string
  tag?: string
}

export interface BuildConfig {
  commands: string[]
  outputDir: string
  assetsPatterns: string[]
}

export interface PackConfig {
  sourceDir: string
  packedFilename: string
  packedFilePath: string
}

export interface RemoteOperatesConfig {
  commands: string[]
  remotePath: string
  clean: boolean
}

export interface DeploymentConfig {
  repository: RepositoryConfig
  buildConfig: BuildConfig
  packConfig: PackConfig
  connectConfig: ConnectConfig
  remoteOperatesConfig: RemoteOperatesConfig
}

export interface Tasks {
  build: (config: DeploymentConfig) => Promise<boolean>
  clear: (config: DeploymentConfig) => Promise<boolean>
  deloy: (config: DeploymentConfig) => Promise<boolean>
  fetchSource: (config: DeploymentConfig) => Promise<boolean>
  processConfig: (config: DeploymentConfig) => Promise<DeploymentConfig>
  pack: (config: DeploymentConfig) => Promise<boolean>
}

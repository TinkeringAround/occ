// ==========================================================
export type TConfiguration = {
  settings: TSettings
  reports: Array<TReport>
}

// ==========================================================
export type TSettings = {
  width: number
  height: number
}

// ==========================================================
export type TReport = {
  progress: number | boolean
  project: string
  url: string
  date: string
  results: Array<TResult>
}

export type TSuiteCategories = {
  server: Array<TSuites>
  seo: Array<TSuites>
  performance: Array<TSuites>
  optimization: Array<TSuites>
}

export type TSuiteCategory = {
  name: string
  suites: Array<TSuites>
}

export type TSuites =
  | 'securityheaders'
  | 'ssllabs'
  | 'seobility'
  | 'favicon-checker'
  | 'gtmetrix'
  | 'hardenize'
  | 'w-three'

export type TImage = {
  url: string
  path: any
}

export type TResult = {
  url: string
  suite: TSuites
  images: Array<TImage>
}

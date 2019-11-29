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

export type TSuites = 'securityheaders' | 'ssllabs' | 'seobility' | 'favicon-checker'

export type TImage = {
  url: string
  path: any
}

export type TResult = {
  url: string
  suite: TSuites
  images: Array<TImage>
}

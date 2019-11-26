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
  project: string
  url: string
  date: string
  results: Array<TResult>
}

export type TSuites = 'securityheaders'

export type TImage = {
  url: string
  binary: any
}

export type TResult = {
  url: string
  suite: TSuites
  images: Array<TImage>
}

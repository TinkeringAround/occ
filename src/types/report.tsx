export type TReport = {
  project: string
  url: string
  date: string
  results: Array<TResult>
}

export type TSuites = 'lighthouse'

export type TImage = {
  url: string
  image: any
}

export type TResult = {
  suite: TSuites
  images: Array<TImage>
}

// Types
import { TSuites, TSuiteCategory, TResult } from '../types'

// ==========================================================
export const ServerSuites: TSuiteCategory = {
  name: 'Server',
  suites: ['ssllabs', 'securityheaders']
}

export const SeoSuites: TSuiteCategory = {
  name: 'SEO & Accessibility',
  suites: ['seobility', 'achecker']
}

export const PerformanceSuites: TSuiteCategory = {
  name: 'Performance',
  suites: ['gtmetrix', 'hardenize']
}

export const OptimizationSuites: TSuiteCategory = {
  name: 'Optimization',
  suites: ['favicon-checker', 'w-three']
}
// ==========================================================
export const getSuiteName: (suite: TSuites) => string = (suite: TSuites) => {
  switch (suite) {
    case 'ssllabs':
      return 'SSL Labs'
    case 'securityheaders':
      return 'Security Headers'
    case 'seobility':
      return 'Seobility'
    case 'gtmetrix':
      return 'GTMetrix'
    case 'hardenize':
      return 'Hardenize'
    case 'favicon-checker':
      return 'Favicon-Checker'
    case 'w-three':
      return 'W3 HTML Validation'
    case 'achecker':
      return 'AChecker'
  }
}

// ==========================================================
export const joinSuitesFromResults: (results: Array<TResult>) => Array<TSuites> = (
  results: Array<TResult>
) => {
  const suites: Array<TSuites> = []
  results.forEach((results: TResult) => suites.push(results.suite))
  return suites
}

// ==========================================================
export const getServerSuites: (suites: Array<TSuites>) => Array<TSuites> = (
  suites: Array<TSuites>
) => {
  var serverSuites: Array<TSuites> = []
  suites.forEach((suite: TSuites) => {
    if (suite === 'ssllabs' || suite === 'securityheaders') serverSuites.push(suite)
  })

  return serverSuites
}

export const getSeoSuites: (suites: Array<TSuites>) => Array<TSuites> = (
  suites: Array<TSuites>
) => {
  var seoSuites: Array<TSuites> = []
  suites.forEach((suite: TSuites) => {
    if (suite === 'seobility' || suite === 'achecker') seoSuites.push(suite)
  })

  return seoSuites
}

export const getPerformanceSuites: (suites: Array<TSuites>) => Array<TSuites> = (
  suites: Array<TSuites>
) => {
  var performanceSuites: Array<TSuites> = []
  suites.forEach((suite: TSuites) => {
    if (suite === 'gtmetrix' || suite === 'hardenize') performanceSuites.push(suite)
  })

  return performanceSuites
}

export const getOptimizationSuites: (suites: Array<TSuites>) => Array<TSuites> = (
  suites: Array<TSuites>
) => {
  var optimizationSuites: Array<TSuites> = []
  suites.forEach((suite: TSuites) => {
    if (suite === 'favicon-checker' || suite === 'w-three') optimizationSuites.push(suite)
  })

  return optimizationSuites
}

// Types
import { TSuites, TSuiteCategory, TResult } from '../types/configuration'

// ==========================================================
export const ServerSuites: TSuiteCategory = {
  name: 'Server',
  suites: ['ssllabs', 'securityheaders']
}

export const SeoSuites: TSuiteCategory = {
  name: 'SEO & Accessibility',
  suites: ['seobility']
}

export const PerformanceSuites: TSuiteCategory = {
  name: 'Performance',
  suites: ['seobility']
}

export const OptimizationSuites: TSuiteCategory = {
  name: 'Optimization',
  suites: ['favicon-checker']
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
    case 'favicon-checker':
      return 'Favicon-Checker'
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
    if (suite === 'seobility') seoSuites.push(suite)
  })

  return seoSuites
}

export const getPerformanceSuites: (suites: Array<TSuites>) => Array<TSuites> = (
  suites: Array<TSuites>
) => {
  var performanceSuites: Array<TSuites> = []
  suites.forEach((suite: TSuites) => {
    if (suite === 'seobility') performanceSuites.push(suite)
  })

  return performanceSuites
}

export const getOptimizationSuites: (suites: Array<TSuites>) => Array<TSuites> = (
  suites: Array<TSuites>
) => {
  var optimizationSuites: Array<TSuites> = []
  suites.forEach((suite: TSuites) => {
    if (suite === 'favicon-checker') optimizationSuites.push(suite)
  })

  return optimizationSuites
}

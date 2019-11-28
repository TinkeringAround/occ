// Types
import { TSuites } from '../types/configuration'

// ==========================================================
export const ServerSuites: {
  name: string
  suites: Array<TSuites>
} = {
  name: 'Server',
  suites: ['ssllabs', 'securityheaders']
}

export const SeoSuites: {
  name: string
  suites: Array<TSuites>
} = {
  name: 'SEO & Accessibility',
  suites: ['seobility']
}

export const PerformanceSuites: {
  name: string
  suites: Array<TSuites>
} = {
  name: 'Performance',
  suites: ['seobility']
}

export const OptimizationSuites: {
  name: string
  suites: Array<TSuites>
} = {
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
export const getServerSuites: (suites: Array<TSuites>) => Array<TSuites> | null = (
  suites: Array<TSuites>
) => {
  var serverSuites: Array<TSuites> = []
  suites.forEach((suite: TSuites) => {
    if (suite === 'ssllabs' || suite === 'securityheaders') serverSuites.push(suite)
  })

  if (serverSuites.length > 0) return serverSuites
  else return null
}

export const getSeoSuites: (suites: Array<TSuites>) => Array<TSuites> | null = (
  suites: Array<TSuites>
) => {
  var seoSuites: Array<TSuites> = []
  suites.forEach((suite: TSuites) => {
    if (suite === 'seobility') seoSuites.push(suite)
  })

  if (seoSuites.length > 0) return seoSuites
  else return null
}

export const getPerformanceSuites: (suites: Array<TSuites>) => Array<TSuites> | null = (
  suites: Array<TSuites>
) => {
  var performanceSuites: Array<TSuites> = []
  suites.forEach((suite: TSuites) => {
    if (suite === 'seobility') performanceSuites.push(suite)
  })

  if (performanceSuites.length > 0) return performanceSuites
  else return null
}

export const getOptimizationSuites: (suites: Array<TSuites>) => Array<TSuites> | null = (
  suites: Array<TSuites>
) => {
  var optimizationSuites: Array<TSuites> = []
  suites.forEach((suite: TSuites) => {
    if (suite === 'favicon-checker') optimizationSuites.push(suite)
  })

  if (optimizationSuites.length > 0) return optimizationSuites
  else return null
}

import { TConfiguration, TReport, TSuites } from '../types'

// ==========================================================
export const closeWindowInMain: () => void = () => {
  // @ts-ignore
  window.electron.ipcRenderer.send('closeWindow')
}

// ==========================================================
export const loadConfigurationFromMain: () => TConfiguration = () => {
  // @ts-ignore
  const config: TConfiguration = window.electron.remote.getGlobal('config')
  return config
}

export const updateConfigInMain = (configuration: TConfiguration) => {
  // @ts-ignore
  window.electron.ipcRenderer.send('updateConfig', configuration)
}

// ==========================================================
export const createReportInMain: (report: TReport, suites: Array<TSuites>) => void = async (
  report: TReport,
  suites: Array<TSuites>
) => {
  // @ts-ignore
  window.electron.ipcRenderer.send('createReport', report, suites)
}

export const cancelProcessedReportInMain: (report: TReport) => void = async (report: TReport) => {
  // @ts-ignore
  window.electron.ipcRenderer.send('cancelReport', report)
}

export const exportReportInMain: (report: TReport, suites: Array<TSuites>) => void = (
  report: TReport,
  suites: Array<TSuites>
) => {
  // @ts-ignore
  window.electron.ipcRenderer.send('exportReport', report, suites, 'zip')
}

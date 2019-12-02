import React from 'react'

// Types
import { TReport, TSuites } from '../types'

// ==========================================================
type ReportContextProps = {
  reports: Array<TReport>

  report: TReport | null
  reportInProgress: boolean
  addReport: (report: TReport, suites: Array<TSuites>) => void
  openReport: (report: TReport) => void
  deleteReport: (report: TReport) => void
  cancelProcessedReport: (report: TReport) => void
  updateReportProject: (report: TReport, project: string) => void
  exportReport: (report: TReport, suites: Array<TSuites>) => void
}

const reportContext = React.createContext<ReportContextProps>({
  reports: [],

  report: null,
  reportInProgress: false,
  addReport: (report: TReport, suites: Array<TSuites>) => {},
  openReport: (report: TReport) => {},
  deleteReport: (report: TReport) => {},
  cancelProcessedReport: (report: TReport) => {},
  updateReportProject: (report: TReport, project: string) => {},
  exportReport: (report: TReport, suites: Array<TSuites>) => {}
})

export default reportContext

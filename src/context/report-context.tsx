import React from 'react'

// Types
import { TReport, TSuites } from '../types/configuration'

// ==========================================================
type ReportContextProps = {
  reports: Array<TReport>

  report: TReport | null
  reportInProgress: boolean
  addReport: (report: TReport, suites: Array<TSuites>) => void
  openReport: (report: TReport) => void
  deleteReport: (report: TReport) => void
}

const reportContext = React.createContext<ReportContextProps>({
  reports: [],

  report: null,
  reportInProgress: false,
  addReport: (report: TReport, suites: Array<TSuites>) => {},
  openReport: (report: TReport) => {},
  deleteReport: (report: TReport) => {}
})

export default reportContext

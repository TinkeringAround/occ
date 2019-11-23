import React from 'react'

// Types
import { TReport } from '../types/report'

// ==========================================================
type ReportContextProps = {
  reports: Array<TReport>

  report: TReport | null
  addReport: (report: TReport) => void
  openReport: (report: TReport) => void
  deleteReport: (report: TReport) => void
}

const reportContext = React.createContext<ReportContextProps>({
  reports: [],

  report: null,
  addReport: (report: TReport) => {},
  openReport: (report: TReport) => {},
  deleteReport: (report: TReport) => {}
})

export default reportContext

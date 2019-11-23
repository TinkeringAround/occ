import React, { FC, useState } from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { PoseGroup } from 'react-pose'

// Styles
import './index.css'

// Types
import { TReport } from './types/report'

// Context
import PageContext from './context/page-context'
import ReportContext from './context/report-context'

// Layout
import Layout from './components/Layout'

// Atoms
import { APage } from './atoms/animations'

// Pages
import Home from './pages/Home'

// ==========================================================
const App: FC = () => {
  const [page, setPage] = useState<number>(0)
  const [reports, setReports] = useState<Array<TReport>>([
    {
      project: 'MKN',
      url: 'mkn.de',
      date: '15. August 2019',
      results: []
    },
    {
      project: 'MKN',
      url: 'configurator.mkn.de',
      date: '16. August 2019',
      results: []
    },
    {
      project: 'Audi BKK',
      url: 'audibkk.de',
      date: '20. August 2019',
      results: []
    }
  ])
  const [report, setReport] = useState<TReport | null>(null)

  const addReport = (report: TReport) => {
    console.log('Add Report')
  }
  const deleteReport = (report: TReport) => {
    const index = reports.findIndex(
      (x: TReport) => x.project === report.project && x.url === report.url && x.date === report.date
    )
    if (index >= 0) {
      const newReports = Array.from(reports)
      newReports.splice(index, 1)
      setReports(newReports)
    }
  }
  const openReport = (report: TReport) => {
    console.log('Open Report')
    setReport(report)
  }

  return (
    <PageContext.Provider
      value={{
        page: page,
        setPage: (newPage: number) => setPage(newPage)
      }}
    >
      <ReportContext.Provider
        value={{
          reports: reports,
          report: report,
          addReport: addReport,
          deleteReport: deleteReport,
          openReport: openReport
        }}
      >
        <Layout>
          <PoseGroup flipMove={false}>
            {page === 0 && (
              <APage key="Home">
                <Home />
              </APage>
            )}
          </PoseGroup>
        </Layout>
      </ReportContext.Provider>
    </PageContext.Provider>
  )
}

// ==========================================================
ReactDOM.render(<App />, document.getElementById('root'))
serviceWorker.unregister()

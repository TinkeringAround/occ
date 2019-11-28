import React, { FC, useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { PoseGroup } from 'react-pose'

// Styles
import './index.css'

// Types
import { TConfiguration, TReport, TResult } from './types/configuration'

// Context
import PageContext from './context/page-context'
import ReportContext from './context/report-context'

// Layout
import Layout from './components/Layout'

// Atoms
import { APage, ALoadingSpinner } from './atoms/animations'

// Components
import LoadingSpinner from './components/LoadingSpinner'

// Pages
import Home from './pages/Home'
import Settings from './pages/Settings'

// Utility
import { loadConfigurationFromMain, updateConfigInMain } from './utility/fs'
import Report from './pages/Report'

// ==========================================================
const App: FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(0)
  const [report, setReport] = useState<TReport | null>(null)
  const [configuration, setConfiguration] = useState<TConfiguration | null>(null)

  // ==========================================================
  const addReport = (report: TReport) => {
    if (configuration) {
      const newReports = Array.from(configuration.reports)
      newReports.push(report)
      setConfiguration({
        ...configuration,
        reports: newReports
      })
    }
  }
  const updateReport = (
    event: any,
    arg: {
      report: TReport
      results: Array<TResult>
    }
  ) => {
    if (configuration) {
      const { report, results } = arg
      const index = configuration.reports.findIndex(
        x => x.date === report.date && x.project === report.project && x.url === report.url
      )
      if (index >= 0) {
        var newReports: Array<TReport> = Array.from(configuration.reports)
        newReports[index] = {
          ...newReports[index],
          results: results
        }

        setConfiguration({
          ...configuration,
          reports: newReports
        })
      }
    }
  }
  const deleteReport = (report: TReport) => {
    if (configuration) {
      const index = configuration.reports.indexOf(report)
      if (index >= 0) {
        const newReports = Array.from(configuration.reports)
        newReports.splice(index, 1)
        setConfiguration({ ...configuration, reports: newReports })
      }
    }
  }
  const openReport = (report: TReport) => {
    setReport(report)
    setPage(1)
  }
  const updateSettings = () => {
    setConfiguration({
      reports: configuration ? configuration.reports : [],
      settings: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    })
  }

  // ==========================================================
  useEffect(() => {
    if (!configuration) {
      const initialConfig: TConfiguration = loadConfigurationFromMain()
      setConfiguration(initialConfig)
    }
  }, [])

  useEffect(() => {
    // @ts-ignore
    window.electron.ipcRenderer.on('reportFinished', updateReport)
    window.addEventListener('resize', updateSettings)
    return () => {
      window.removeEventListener('resize', updateSettings)
      // @ts-ignore
      window.electron.ipcRenderer.removeAllListeners()
    }
  })

  useEffect(() => {
    if (configuration) updateConfigInMain(configuration)
  }, [configuration])

  useEffect(() => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }, [page])

  // ==========================================================
  return (
    <PageContext.Provider
      value={{
        page: page,
        setPage: (newPage: number) => setPage(newPage)
      }}
    >
      <ReportContext.Provider
        value={{
          reports: configuration ? configuration.reports : [],
          report: report,
          addReport: addReport,
          deleteReport: deleteReport,
          openReport: openReport
        }}
      >
        {configuration && (
          <Layout>
            <PoseGroup flipMove={false}>
              {loading && (
                <ALoadingSpinner key="LS">
                  <LoadingSpinner />
                </ALoadingSpinner>
              )}

              {!loading && (
                <APage key={'Page-' + page}>
                  {page === 0 && <Home />}
                  {page === 1 && <Report />}
                  {page === 2 && <Settings />}
                </APage>
              )}
            </PoseGroup>
          </Layout>
        )}
      </ReportContext.Provider>
    </PageContext.Provider>
  )
}

// ==========================================================
ReactDOM.render(<App />, document.getElementById('root'))
serviceWorker.unregister()

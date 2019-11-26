import React, { FC, useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { PoseGroup } from 'react-pose'

// Styles
import './index.css'

// Types
import { TConfiguration, TReport } from './types/configuration'

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
import { loadConfiguration, updateConfiguration } from './utility/fs'

// ==========================================================
const App: FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(0)
  const [report, setReport] = useState<TReport | null>(null)
  const [configuration, setConfiguration] = useState<TConfiguration | null>(null)

  // Setup
  // @ts-ignore
  if (!window['statusInterval']) {
    // Check status every 10 sek
    // @ts-ignore
    window['statusInterval'] = setInterval(async () => {
      const newConfiguration: TConfiguration = loadConfiguration()
      setConfiguration(newConfiguration)
      console.log('Reload Configuration', newConfiguration)
    }, 10000)
  }

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
  const openReport = (report: TReport) => setReport(report)
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
      const newConfiguration: TConfiguration = loadConfiguration()
      setConfiguration(newConfiguration)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('resize', updateSettings)
    return () => window.removeEventListener('resize', updateSettings)
  })

  useEffect(() => {
    if (configuration) updateConfiguration(configuration)
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
                  {page === 1 && <Settings />}
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

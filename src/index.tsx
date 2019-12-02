import React, { FC, useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { PoseGroup } from 'react-pose'

// Styles
import './index.css'

// Types
import { TConfiguration, TReport, TResult, TSuites, TSettings } from './types'

// Context
import PageContext from './context/page-context'
import ReportContext from './context/report-context'
import SettingsContext from './context/settings-context'

// Layout
import Layout from './components/Layout'

// Atoms
import { APage, ALoadingSpinner } from './atoms/animations'

// Components
import LoadingSpinner from './components/LoadingSpinner'
import Confirmation from './components/Confirmation'

// Pages
import Home from './pages/Home'
import Settings from './pages/Settings'
import Report from './pages/Report'

// Utility
import {
  loadConfigurationFromMain,
  updateConfigInMain,
  createReportInMain,
  cancelProcessedReportInMain,
  closeWindowInMain,
  exportReportInMain
} from './utility/fs'
import { sortReportsByTimestring } from './utility/time'

// ==========================================================
const App: FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(0)
  const [configuration, setConfiguration] = useState<TConfiguration | null>(null) // Configuration

  const [report, setReport] = useState<TReport | null>(null) // Open Report
  const [reportInProgress, setReportInProgress] = useState<boolean>(false) // If Report ist currently processed

  // Confirmation Dialog
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
  const [closeWindow, setCloseWindow] = useState<boolean>(false)

  // ==========================================================
  // #region Report Context
  const addReport = (report: TReport, suites: Array<TSuites>) => {
    if (configuration) {
      const newReports = Array.from(configuration.reports)
      newReports.push(report)
      const sortedReports = sortReportsByTimestring(newReports)
      setConfiguration({
        ...configuration,
        reports: sortedReports
      })

      createReportInMain(report, suites)
      setReportInProgress(true)
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
      const { report: updatedReport, results } = arg
      const index = configuration.reports.findIndex(
        x => x.date === updatedReport.date && x.url === updatedReport.url
      )
      if (index >= 0) {
        var newReports: Array<TReport> = Array.from(configuration.reports)
        newReports[index] = {
          ...newReports[index],
          progress: updatedReport.progress,
          results: results
        }

        if (
          report != null &&
          report.url === updatedReport.url &&
          report.date === updatedReport.date
        ) {
          setReport(newReports[index])
        }

        if (updatedReport.progress === true || updatedReport.progress === false)
          setReportInProgress(false)
        setConfiguration({
          ...configuration,
          reports: newReports
        })
      }
    }
  }
  const deleteReport = (deletedReport: TReport) => {
    if (configuration) {
      const index = configuration.reports.findIndex(
        x => x.date === deletedReport.date && x.url === deletedReport.url
      )
      if (index >= 0) {
        const newReports = Array.from(configuration.reports)
        newReports.splice(index, 1)

        if (report && report.url === deletedReport.url && report.date === deletedReport.date)
          setReport(null)

        const sortedReports = sortReportsByTimestring(newReports)
        setConfiguration({ ...configuration, reports: sortedReports })
      }
    }
  }
  const openReport = (report: TReport) => {
    setReport(report)
    setPage(1)
  }
  const cancelProcessedReport = (report: TReport) => cancelProcessedReportInMain(report)
  const updateReportProject = (changedReport: TReport, project: string) => {
    if (configuration) {
      const index = configuration.reports.findIndex(
        x => x.date === changedReport.date && x.url === changedReport.url
      )
      if (index >= 0) {
        const newReports: Array<TReport> = Array.from(configuration.reports)
        newReports[index] = {
          ...newReports[index],
          project: project
        }

        setReport(newReports[index])
        setConfiguration({ ...configuration, reports: newReports })
      }
    }
  }
  const showConfirmationDialog = (event: any) => {
    if (reportInProgress) {
      setShowConfirmation(true)
      event.returnValue = 'prevent'
    }
  }
  const exportReport = (report: TReport, suites: Array<TSuites>) =>
    exportReportInMain(report, suites)
  // #endregion

  // ==========================================================
  // #region Settings Context
  const updateWindowSize = () => {
    if (configuration) {
      setConfiguration({
        reports: configuration.reports,
        settings: {
          ...configuration.settings,
          width: window.innerWidth,
          height: window.innerHeight
        }
      })
    }
  }

  const updateSettings = (settings: TSettings) => {
    if (configuration) {
      setConfiguration({
        reports: configuration.reports,
        settings: settings
      })
    }
  }
  // #endregion

  // ==========================================================
  // #region State Handler
  useEffect(() => {
    if (!configuration) {
      const initialConfig: TConfiguration = loadConfigurationFromMain()
      const sortedReports = sortReportsByTimestring(initialConfig.reports)
      setConfiguration({
        ...initialConfig,
        reports: sortedReports
      })
    }
  }, [])

  useEffect(() => {
    window.addEventListener('beforeunload', showConfirmationDialog)
    // @ts-ignore
    window.electron.ipcRenderer.on('updateReport', updateReport)
    window.addEventListener('resize', updateWindowSize)
    return () => {
      window.removeEventListener('beforeunload', showConfirmationDialog)
      window.removeEventListener('resize', updateWindowSize)
      // @ts-ignore
      window.electron.ipcRenderer.removeAllListeners()
    }
  })

  useEffect(() => {
    if (configuration) {
      updateConfigInMain(configuration)
    }
  }, [configuration])

  useEffect(() => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }, [page])

  useEffect(() => {
    if (report == null && page === 1) setPage(0)
  }, [report])

  useEffect(() => {
    if (closeWindow) closeWindowInMain()
  }, [closeWindow])
  // #endregion
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
          reportInProgress: reportInProgress,
          addReport: addReport,
          deleteReport: deleteReport,
          cancelProcessedReport: cancelProcessedReport,
          openReport: openReport,
          updateReportProject: updateReportProject,
          exportReport: exportReport
        }}
      >
        <SettingsContext.Provider
          value={{
            settings: configuration ? configuration.settings : null,
            updateSettings: updateSettings
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

          <Confirmation
            show={showConfirmation}
            accept={() => setCloseWindow(true)}
            cancel={() => setShowConfirmation(false)}
          />
        </SettingsContext.Provider>
      </ReportContext.Provider>
    </PageContext.Provider>
  )
}

// ==========================================================
ReactDOM.render(<App />, document.getElementById('root'))
serviceWorker.unregister()

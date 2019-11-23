import React, { FC, useState } from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { PoseGroup } from 'react-pose'

// Styles
import './index.css'

// Context
import PageContext from './context/page-context'

// Layout
import Layout from './components/Layout'

// Atoms
import { APage } from './atoms/animations'

// Pages
import Home from './pages/Home'

// ==========================================================
const App: FC = () => {
  const [page, setPage] = useState<number>(0)

  return (
    <PageContext.Provider
      value={{
        page: page,
        setPage: (newPage: number) => setPage(newPage)
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
    </PageContext.Provider>
  )
}

// ==========================================================
ReactDOM.render(<App />, document.getElementById('root'))
serviceWorker.unregister()

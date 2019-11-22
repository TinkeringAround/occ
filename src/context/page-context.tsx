import React from 'react'

const pageContext = React.createContext({
  page: 0,
  setPage: (newPage: number) => {}
})

export default pageContext

import { TReport } from '../types/configuration'

// ==========================================================
export const unixTimeToSting = (unix: number) => {
  var a = new Date(unix)
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  var year = a.getFullYear()
  var month = months[a.getMonth()]
  var date = a.getDate()
  var time = date + '. ' + month + ' ' + year
  return time
}

// ==========================================================
export const sortReportsByTimestring: (array: Array<TReport>) => Array<TReport> = (
  array: Array<TReport>
) => {
  let newArray = Array.from(array)
  const sortedArray = newArray.sort((a: TReport, b: TReport) => {
    if (a.date === b.date) return 0
    else if (a.date > b.date) return -1
    else return 1
  })
  return sortedArray
}

import React, { FC } from 'react'

// ===================================================================
interface Props {
  height?: string
}

// ===================================================================
const TableSpacer: FC<Props> = ({ height = '1rem' }) => {
  let items = new Array(4)
  for (let i = 0; i < 4; i++) items.push(i)

  return (
    <tr style={{ height: height, background: 'transparent' }}>
      {items.map((index: any) => (
        <td key={'Spacer-' + index} />
      ))}
    </tr>
  )
}

export default TableSpacer

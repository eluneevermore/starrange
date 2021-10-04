import React from 'react'
import COLOR from './color'

const Edge = ({ edge, currentColor }) => {
  const [_, __, [x1, y1], [x2, y2], hightlight] = edge
  const stroke = hightlight ? COLOR[currentColor] : 'black'
  const strokeWidth = hightlight ? 4 : 2
  return (
    <line {...{ x1, y1, x2, y2 }} {...{ stroke, strokeWidth }} />
  )
}

export default Edge

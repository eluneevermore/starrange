import React from 'react'
import COLOR from './color'

const Node = ({ position, background, color, selected, onSelect }) => {
  const [x, y] = position

  return (
    <g className='node' onClick={onSelect} pointerEvents='all'>
      <circle cx={x} cy={y} r={25} stroke={COLOR[background]} fill='none' strokeWidth={5} />
      <circle cx={x} cy={y} r={15} fill={color === 0 ? 'none' : COLOR[color]} className={selected ? 'selected' : ''} />
    </g>
  )
}

export default Node

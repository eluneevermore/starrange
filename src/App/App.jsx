import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Edge from './Edge'
import map from './map'
import Node from './Node'
import Queue from './Queue'

const swap = (ar, x, y) => {
  const newAr = ar.slice(0)
  newAr[x] = ar[y]
  newAr[y] = ar[x]
  return newAr
}

const getDistances = (relations, colors, from) => {
  const distances = Array.from({ length: relations.length }, () => -1)
  if (from == null) { return distances }

  const queue = new Queue()
  const travel = () => {
    const [from, distance] = queue.dequeue()
    distances[from] = distance
    relations[from].forEach(node => {
      if (distances[node] < 0 && !colors[node]) {
        queue.enqueue([node, distance + 1])
      }
    })
  }
  queue.enqueue([from, 0])
  while (!queue.empty()) {
    travel()
  }
  return distances
}

const App = () => {
  const [level, setLevel] = useState(0)
  // Round
  const [positions, setPositions] = useState([])
  const [backgrounds, setBackgrounds] = useState([])
  const [colors, setColors] = useState([])
  const [relations, setRelations] = useState([])
  const [limitMove, setLimitMove] = useState(0)

  const [node, setNode] = useState(null)

  const [wonGame, setWonGame] = useState(false)
  const [move, setMove] = useState(0)
  const [totalMove, setTotalMove] = useState(0)

  const distances = useMemo(() => {
    return getDistances(relations, colors, node)
  }, [relations, node])

  const wonRound = useMemo(() => {
    return (colors.length > 0) && colors.every((color, idx) => color === backgrounds[idx])
  }, [colors, backgrounds])

  const lostRound = useMemo(() => {
    return (move >= limitMove) && !wonRound && move > 0
  }, [move, limitMove, wonRound])

  const currentColor = useMemo(() => {
    return colors[node]
  }, [colors, node])

  const edges = useMemo(() => {
    return relations.reduce((edges, endNodes, start) => {
      edges.push(...endNodes.map(end => {
        const hightlight = distances[start] >= 0 && distances[end] >= 0
        return [start, end, positions[start], positions[end], hightlight]
      }))
      return edges
    }, [])
  }, [positions, relations, distances])

  const loadLevel = useCallback((level) => {
    let data = map[level]
    if (!data) {
      data = []
      setWonGame(true)
    }
    const [positions = [], backgrounds = [], colors = [], relations = [], limitMove = 0] = JSON.parse(JSON.stringify(data))
    setMove(0)
    setPositions(positions)
    setBackgrounds(backgrounds)
    setColors(colors)
    setRelations(relations)
    setLimitMove(limitMove)
  }, [map, setPositions, setBackgrounds, setColors, setRelations])

  const select = useCallback((newNode) => {
    if (node != null && !colors[newNode] && (distances[newNode] > 0)) {
      setColors(swap(colors, node, newNode))
      setMove(move + 1)
      setNode(null)
    } else if (colors[newNode]) {
      setNode(newNode)
    }
  }, [node, colors])

  const nextLevel = useCallback(() => {
    setTotalMove(move + totalMove)
    setLevel(level + 1)
  }, [level, move, totalMove, setLevel, setTotalMove])

  const resetLevel = useCallback(() => {
    loadLevel(level)
  }, [level])

  useEffect(() => loadLevel(level), [level])

  useEffect(() => {
    if (wonRound) {
      // alert('You won!')
      nextLevel()
    }
  }, [wonRound])
  useEffect(() => {
    if (lostRound) {
      alert('You lost!')
      resetLevel()
    }
  }, [lostRound])

  return (
    <div>
      {wonGame
        ? <>
          <h1>Congratulation! You won with {totalMove} moves! Reload to play again</h1>
        </>
        : <>
          <div>LEVEL <b>{level + 1}/{map.length}</b></div>
          <div>
            Move: <b>{move}</b>,
            Limit: <b>{limitMove}</b>,
            Total: <b>{totalMove + move}</b>,
          </div>
          <div>
            <a onClick={() => resetLevel()} href='#'><b>Reset</b></a>
          </div>
          <svg viewBox="0 0 1000 1000">
            {edges.map((edge, idx) =>
              <Edge key={idx} {...{ edge, currentColor }} />
            )}
            {positions.map((position, idx) =>
              <Node key={idx}
                position={position}
                background={backgrounds[idx]}
                color={colors[idx]}
                selected={idx === node}
                onSelect={() => select(idx)} />
            )}
          </svg>
        </>
      }
    </div>
  )
}

export default App

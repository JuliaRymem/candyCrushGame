import { useEffect, useState, useCallback } from 'react'
import ScoreBoard from './components/ScoreBoard'
import blueCandy from './images/blue-candy.png'
import greenCandy from './images/green-candy.png'
import orangeCandy from './images/orange-candy.png'
import purpleCandy from './images/purple-candy.png'
import redCandy from './images/red-candy.png'
import yellowCandy from './images/yellow-candy.png'
import blank from './images/blank.png'

const width = 8
const candyColors = [
    blueCandy,
    orangeCandy,
    purpleCandy,
    redCandy,
    yellowCandy,
    greenCandy
]

const App = () => {
    const [currentColorArrangement, setCurrentColorArrangement] = useState([])
    const [squareBeingDragged, setSquareBeingDragged] = useState(null)
    const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
    const [scoreDisplay, setScoreDisplay] = useState(0)

    const checkForColumnOfFour = useCallback(() => {
        const newArrangement = [...currentColorArrangement]
        for (let i = 0; i <= 39; i++) {
            const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
            const decidedColor = newArrangement[i]
            const isBlank = decidedColor === blank

            if (columnOfFour.every(square => newArrangement[square] === decidedColor && !isBlank)) {
                columnOfFour.forEach(square => newArrangement[square] = blank)
                setScoreDisplay(score => score + 4)
                setCurrentColorArrangement(newArrangement)
                return true
            }
        }
        return false
    }, [currentColorArrangement])

    const checkForRowOfFour = useCallback(() => {
        const newArrangement = [...currentColorArrangement]
        const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]
        for (let i = 0; i < 64; i++) {
            if (notValid.includes(i)) continue
            const rowOfFour = [i, i + 1, i + 2, i + 3]
            const decidedColor = newArrangement[i]
            const isBlank = decidedColor === blank

            if (rowOfFour.every(square => newArrangement[square] === decidedColor && !isBlank)) {
                rowOfFour.forEach(square => newArrangement[square] = blank)
                setScoreDisplay(score => score + 4)
                setCurrentColorArrangement(newArrangement)
                return true
            }
        }
        return false
    }, [currentColorArrangement])

    const checkForColumnOfThree = useCallback(() => {
        const newArrangement = [...currentColorArrangement]
        for (let i = 0; i <= 47; i++) {
            const columnOfThree = [i, i + width, i + width * 2]
            const decidedColor = newArrangement[i]
            const isBlank = decidedColor === blank

            if (columnOfThree.every(square => newArrangement[square] === decidedColor && !isBlank)) {
                columnOfThree.forEach(square => newArrangement[square] = blank)
                setScoreDisplay(score => score + 3)
                setCurrentColorArrangement(newArrangement)
                return true
            }
        }
        return false
    }, [currentColorArrangement])

    const checkForRowOfThree = useCallback(() => {
        const newArrangement = [...currentColorArrangement]
        const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]
        for (let i = 0; i < 64; i++) {
            if (notValid.includes(i)) continue
            const rowOfThree = [i, i + 1, i + 2]
            const decidedColor = newArrangement[i]
            const isBlank = decidedColor === blank

            if (rowOfThree.every(square => newArrangement[square] === decidedColor && !isBlank)) {
                rowOfThree.forEach(square => newArrangement[square] = blank)
                setScoreDisplay(score => score + 3)
                setCurrentColorArrangement(newArrangement)
                return true
            }
        }
        return false
    }, [currentColorArrangement])

    const moveIntoSquareBelow = useCallback(() => {
        const newArrangement = [...currentColorArrangement]
        for (let i = 0; i <= 55; i++) {
            const isFirstRow = i < width
            if (isFirstRow && newArrangement[i] === blank) {
                const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
                newArrangement[i] = randomColor
            }
            if (newArrangement[i + width] === blank) {
                newArrangement[i + width] = newArrangement[i]
                newArrangement[i] = blank
            }
        }
        setCurrentColorArrangement(newArrangement)
    }, [currentColorArrangement])

    const dragStart = (e) => {
        setSquareBeingDragged(e.target)
    }

    const dragDrop = (e) => {
        setSquareBeingReplaced(e.target)
    }

    const dragEnd = () => {
        const draggedId = parseInt(squareBeingDragged?.getAttribute('data-id'))
        const replacedId = parseInt(squareBeingReplaced?.getAttribute('data-id'))

        if (isNaN(draggedId) || isNaN(replacedId)) return

        const newArrangement = [...currentColorArrangement]
        const draggedSrc = squareBeingDragged.getAttribute('src')
        const replacedSrc = squareBeingReplaced.getAttribute('src')

        newArrangement[replacedId] = draggedSrc
        newArrangement[draggedId] = replacedSrc

        const validMoves = [
            draggedId - 1,
            draggedId - width,
            draggedId + 1,
            draggedId + width
        ]

        const isValidMove = validMoves.includes(replacedId)

        setCurrentColorArrangement(newArrangement)

        const validMatch =
            isValidMove &&
            (checkForColumnOfFour() ||
                checkForRowOfFour() ||
                checkForColumnOfThree() ||
                checkForRowOfThree())

        if (!validMatch) {
            // Ogiltigt drag – återställ
            newArrangement[replacedId] = replacedSrc
            newArrangement[draggedId] = draggedSrc
            setCurrentColorArrangement([...newArrangement])
        }

        setSquareBeingDragged(null)
        setSquareBeingReplaced(null)
    }

    const createBoard = () => {
        const randomColors = []
        for (let i = 0; i < width * width; i++) {
            const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
            randomColors.push(randomColor)
        }
        setCurrentColorArrangement(randomColors)
    }

    useEffect(() => {
        createBoard()
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            checkForColumnOfFour()
            checkForRowOfFour()
            checkForColumnOfThree()
            checkForRowOfThree()
            moveIntoSquareBelow()
        }, 100)
        return () => clearInterval(timer)
    }, [checkForColumnOfFour, checkForRowOfFour, checkForColumnOfThree, checkForRowOfThree, moveIntoSquareBelow])

    return (
        <div className="app">
            <div className="game">
                {currentColorArrangement.map((candyColor, index) => (
                    <img
                        key={index}
                        src={candyColor}
                        alt="candy"
                        data-id={index}
                        draggable={true}
                        onDragStart={dragStart}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => e.preventDefault()}
                        onDragLeave={(e) => e.preventDefault()}
                        onDrop={dragDrop}
                        onDragEnd={dragEnd}
                    />
                ))}
            </div>
            <ScoreBoard score={scoreDisplay} />
        </div>
    )
}

export default App

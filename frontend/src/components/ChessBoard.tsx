import React, { useState, useEffect } from "react"
import styled from "styled-components"
import {DndContext} from "@dnd-kit/core"

enum COLOR { WHITE = "white", BLACK = "black" }
enum PIECE_TYPE { "pawn", "knight", "rook", "bishop", "queen", "king" }
enum COLUMN_LETTER {A = 1, B, C, D, E, F, G, H}
enum ROW_NUMBER {One = 1, Two, Three, Four, Five, Six, Seven, Eight}

const NUM_ROWS = 8
const NUM_COLUMNS = 8

const BoardContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: black;
  display: flex;
  flex-wrap: wrap;
  gap: 0;
`

interface SquareContainerProps{
  $color: COLOR
}

const SquareContainer = styled.div<SquareContainerProps>`
  background-color: ${props => props.$color === COLOR.WHITE ? props.theme.palette.common.whiteSquare : props.theme.palette.common.blackSquare};
  width: calc(100% / 8);
  height: calc(100% / 8);
  margin: 0;
  padding: 0;
  z-index: 10;
`

/* SHOULD BE 2D ARRAY WHICH TRACKS SQUARES AND THEIR CONTENTS

let squareContents : Square[][] = [][]



*/




interface ChessSquare {
  squareColumn: COLUMN_LETTER,
  squareRow: ROW_NUMBER,
  squareColor: COLOR,
  piece?: PIECE_TYPE | null,
  pieceColor?: COLOR
}

interface SquareProps {
  square: ChessSquare
}

const Square = (props : SquareProps) => {
  return(
    <SquareContainer $color={props.square.squareColor}>
    </SquareContainer>
  )
}

const ChessBoard = () => {
  const [squares, setSquares] = useState<ChessSquare[]>([])

  let currentWhite = true

  const populateSquares = () => {
    const newSquares : ChessSquare[] = []
    for (let row = 1; row <= NUM_ROWS; row++){
      for (let column = 1; column <= NUM_COLUMNS; column++){
        if (currentWhite === true){
          newSquares.push({
            squareColumn: column,
            squareRow: row,
            squareColor: COLOR.WHITE,
          })
        }
        else {
          newSquares.push({
            squareColumn: column,
            squareRow: row,
            squareColor: COLOR.BLACK,
          })
        }

        currentWhite = !currentWhite
      }
      currentWhite = !currentWhite
    }
    setSquares(newSquares)
  }

  useEffect(() => {
    populateSquares()
  }, [])

  const mappedSquares = squares.map((square) => {
    return(<Square key={`column${square.squareColumn}row${square.squareRow}`} square={square} />)
  })

  console.log("Squares is: ", squares)

  return(
    <DndContext>
      <BoardContainer>
            {mappedSquares}
      </BoardContainer>
    </DndContext>
  )
}

export default ChessBoard
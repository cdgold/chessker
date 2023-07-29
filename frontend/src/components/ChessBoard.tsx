import React from "react"
import styled from "styled-components"
import {DndContext} from "@dnd-kit/core"

enum color { "white", "black" }
enum pieceType { "pawn", "knight", "rook", "bishop", "queen", "king" }

const BoardContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: black;
`

interface SquareContainerProps{
  $color: color
}

const SquareContainer = styled.div<SquareContainerProps>`
  background-color: ${props => props.$color === color.white ? props.theme.palette.common.whiteSquare : props.theme.palette.common.blackSquare};
  width: calc(100% / 8);
  height: calc(100% / 8);
  z-index: 10;
`

// SHOULD BE 2D ARRAY WHICH TRACKS SQUARES AND THEIR CONTENTS
// 




interface SquareProps {
  squareNum: string,
  squareColor: color,
  piece?: pieceType | null,
  pieceColor?: color
}

const Square = (props : SquareProps) => {
  return(
    <SquareContainer $color={color.white}>

    </SquareContainer>
  )
}

const ChessBoard = () => {
  const squares = []

  return(
    <DndContext>
      <BoardContainer>
        <Square squareNum="A1" squareColor={color.white} />
      </BoardContainer>
    </DndContext>
  )
}

export default ChessBoard
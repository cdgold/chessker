/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

// of course above rules are unideal, but typesafety with third party library (dndkit) is headache

import React, { useState, useEffect, ReactNode } from "react"
import styled from "styled-components"
import {DndContext, useDroppable } from "@dnd-kit/core"
import ChessPiece from "./ChessPiece"
import { COLOR, PIECE_TYPE, COLUMN_LETTER, ROW_NUMBER, ChessSquare } from "../types/chess" 
import { checkMoveLegality, checkKingSafety, calcSquareNum } from "../gameLogic/chessLogic"

const NUM_ROWS = 8
const NUM_COLUMNS = 8

// make hover square better looking
// incorporate knight checks
// include castling, en passant
// include promotion
// switch on display piece

const BoardContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: black;
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  position: relative;
`

interface SquareContainerProps{
  $color: COLOR,
  $filter: boolean
}

const SquareContainer = styled.div<SquareContainerProps>`
  background-color: ${props => props.$color === COLOR.WHITE ? props.theme.palette.common.whiteSquare : props.theme.palette.common.blackSquare};
  width: calc(100% / 8);
  height: calc(100% / 8);
  margin: 0;
  padding: 0;
  display: grid;
  position: relative;
  z-index: auto;
  ${props => props.$filter ? "background-color: blue" : null}
`

interface SquareProps {
  square: ChessSquare
}

const Square = (props : SquareProps) => {

  const {isOver, setNodeRef} = useDroppable({
    id: `c${props.square.column}r${props.square.row}`,
    data: {
      row: props.square.row,
      column: props.square.column
    }
  })

  if(props.square.piece){ 
    return(
      <SquareContainer $color={props.square.squareColor} $filter={isOver} ref={setNodeRef}>
        <ChessPiece 
          type={props.square.piece} 
          color={props.square.pieceColor} 
          id={`pc${props.square.column}r${props.square.row}`} 
          column={props.square.column}
          row={props.square.row}
        />
      </SquareContainer>
    )
  }

  return(
    <SquareContainer $color={props.square.squareColor} $filter={isOver} ref={setNodeRef}>
    </SquareContainer>
  )
}

const ChessBoard = () => {
  const [squares, setSquares] = useState<ChessSquare[]>([])

  let currentWhite = false

  const populateSquares = () => {
    const newSquares : ChessSquare[] = []
    for (let row = 1; row <= NUM_ROWS; row++){
      for (let column = 1; column <= NUM_COLUMNS; column++){
        const newSquare = {column: column, row: row}
        if (currentWhite === true){
          newSquare["squareColor"] = COLOR.WHITE
        }
        else {
          newSquare["squareColor"] = COLOR.BLACK
        }

        if ((row <= 2)){
          newSquare["pieceColor"] = COLOR.WHITE
        }
        if ((row >= 7)){
          newSquare["pieceColor"] = COLOR.BLACK
        }
        if (row === 1 || row === 8){
          if ((column === 1 || column === 8)){
            newSquare["piece"] = PIECE_TYPE.ROOK
          }
          if ((column === 2 || column === 7)){
            newSquare["piece"] = PIECE_TYPE.KNIGHT
          }
          if ((column === 3 || column === 6)){
            newSquare["piece"] = PIECE_TYPE.BISHOP
          }
          if ((column === 4)){
            newSquare["piece"] = PIECE_TYPE.QUEEN
          }
          if ((column === 5)){
            newSquare["piece"] = PIECE_TYPE.KING
          }
        }
        if (row === 2 || row === 7){
          newSquare["piece"] = PIECE_TYPE.PAWN
        }

        const pushSquare = newSquare as ChessSquare
        newSquares.push(pushSquare)

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
    return(<Square key={`c${square.column}r${square.row}`} square={square} />)
  })

  function handleDragEnd(event: any) {
    console.log(event)
    if (event.over && event.active) {
      const over = event.over
      const active = event.active

      const newSquares = [ ...squares ]

      const originRowNum = parseInt(active.data.current.row as string)
      const originColNum = parseInt(active.data.current.column as string)
      const destinationRowNum = parseInt(over.data.current.row as string)
      const destinationColNum = parseInt(over.data.current.column as string)
      const destinationSquareNum = calcSquareNum({ row: destinationRowNum, column: destinationColNum })
      const destinationSquare = squares[destinationSquareNum]
      const destinationPieceType = destinationSquare.piece
      const destinationPieceColor = destinationSquare.pieceColor
      if (destinationPieceColor !== active.data.current.color && destinationPieceType !== PIECE_TYPE.KING){
        const trueIfCanCapture = (destinationPieceType !== undefined)
        if (checkMoveLegality({ 
          thisPieceType: active.data.current.type, 
          thisPieceColor: active.data.current.color,
          currentColumn: originColNum, 
          currentRow: originRowNum,
          destinationColumn: destinationColNum,
          destinationRow: destinationRowNum,
          canCapture: trueIfCanCapture,
          squares: squares })){

          const originSquareNum = calcSquareNum({ row: originRowNum, column: originColNum })
          newSquares[originSquareNum] = { ...squares[originSquareNum], piece: undefined, pieceColor: undefined }
          newSquares[destinationSquareNum] = { ...squares[destinationSquareNum], piece: active.data.current.type, pieceColor: active.data.current.color }
          if (checkKingSafety({ kingColor: active.data.current.color, squaresToCheck: newSquares })){
            setSquares(newSquares)
          }
        }
      }
    }
  }

  return(
    <DndContext onDragEnd={handleDragEnd}>
      <BoardContainer>
        {mappedSquares}
      </BoardContainer>
    </DndContext>
  )

}

export default ChessBoard


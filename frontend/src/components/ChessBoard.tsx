/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

// of course above rules are unideal, but typesafety with third party library (dndkit) is headache

import React, { useState, useEffect, ReactNode } from "react"
import styled from "styled-components"
import {DndContext, useDroppable, useDraggable} from "@dnd-kit/core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChessKing, faChessQueen, faChessRook, faChessBishop, faChessKnight, faChessPawn } from "@fortawesome/free-solid-svg-icons"

enum COLOR { WHITE = "white", BLACK = "black" }
enum PIECE_TYPE { PAWN = "pawn", KNIGHT = "knight", ROOK = "rook", BISHOP = "bishop", QUEEN = "queen", KING = "king" }
enum COLUMN_LETTER {A = 1, B, C, D, E, F, G, H}
enum ROW_NUMBER {One = 1, Two, Three, Four, Five, Six, Seven, Eight}

const NUM_ROWS = 8
const NUM_COLUMNS = 8

// if piece starts and ends on same square, don't count as move
// switch on display piece
// make hover square better looking

const PieceContainer = styled.div`
  touch-action: none;
  width: min-content;
  font-size: 50px;
  place-self: center;
  
  position: relative;
  z-index: 100;
  
  &: hover {
    cursor: pointer;
  }
`

interface DraggablePieceProps {
  id: string,
  children: ReactNode,
  color: COLOR,
  type: PIECE_TYPE,
  column: COLUMN_LETTER,
  row: ROW_NUMBER
}

const DraggableContainer = styled.div`
  place-self: center;
`

const DraggablePiece = (props : DraggablePieceProps) => {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
    data: {
      type: props.type,
      color: props.color,
      column: props.column,
      row: props.row
    }
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 200
  }
  : undefined;

  return (
    <DraggableContainer ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </DraggableContainer>
  )
}

interface DisplayPieceProps {
  type: PIECE_TYPE
}


const DisplayPiece = (props : DisplayPieceProps) => {
  //console.log(`type: ${props.type} and color: ${props.color}`)
  if (props.type === PIECE_TYPE.KING){
  return(
    <FontAwesomeIcon icon={faChessKing} />
  )
  }
  else if (props.type === PIECE_TYPE.QUEEN){
    return(
      <FontAwesomeIcon icon={faChessQueen} />
    )
  }
  else if (props.type === PIECE_TYPE.BISHOP){
    return(
      <FontAwesomeIcon icon={faChessBishop} />
    )
  }
  else if (props.type === PIECE_TYPE.KNIGHT){
    return(
      <FontAwesomeIcon icon={faChessKnight} />
    )
  }
  else if (props.type === PIECE_TYPE.ROOK){
    return(
      <FontAwesomeIcon icon={faChessRook} />
    )
  }
  else if (props.type === PIECE_TYPE.PAWN){
    return(
      <FontAwesomeIcon icon={faChessPawn} />
    )
  }
  return(null)
}

interface ChessPieceProps {
  type: PIECE_TYPE,
  color: COLOR,
  id: string,
  column: COLUMN_LETTER,
  row: ROW_NUMBER
}

const ChessPiece = (props : ChessPieceProps) => {
  let showColor : string = ""
  props.color === COLOR.WHITE ?  showColor = "white" : showColor = "black"

  return (
    <DraggablePiece id={props.id} type={props.type} color={props.color} column={props.column} row={props.row}>
    <PieceContainer>
      <span style={{ color: showColor }}>
          <DisplayPiece type={props.type} />
      </span>
    </PieceContainer>
    </DraggablePiece>
  )
}


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

interface ChessSquare {
  column: COLUMN_LETTER,
  row: ROW_NUMBER,
  squareColor: COLOR,
  piece?: PIECE_TYPE | null,
  pieceColor?: COLOR
}

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

  interface calcSquareNumProps{
    column: number,
    row: number
  }

  const calcSquareNum = (props : calcSquareNumProps) => {
    let squareNum = props.column - 1
    squareNum = squareNum + ((props.row - 1) * NUM_COLUMNS)
    return squareNum
  }

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

  console.log("Squares is: ", squares)

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
      
      // check move legality

      const originSquareNum = calcSquareNum({ row: originRowNum, column: originColNum })
      newSquares[originSquareNum] = { ...squares[originSquareNum], piece: undefined, pieceColor: undefined }
      const destinationSquareNum = calcSquareNum({ row: destinationRowNum, column: destinationColNum })
      newSquares[destinationSquareNum] = { ...squares[destinationSquareNum], piece: active.data.current.type, pieceColor: active.data.current.color }
      setSquares(newSquares)
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


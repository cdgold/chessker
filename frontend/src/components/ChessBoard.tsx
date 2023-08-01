/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

// of course above rules are unideal, but typesafety with third party library (dndkit) is headache

import React, { useState, useEffect, ReactNode } from "react"
import styled from "styled-components"
import {DndContext, useDroppable } from "@dnd-kit/core"
import ChessPiece from "./ChessPiece"
import { COLOR, PIECE_TYPE, COLUMN_LETTER, ROW_NUMBER } from "../types/chess" 

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

interface ChessSquare {
  column: COLUMN_LETTER,
  row: ROW_NUMBER,
  squareColor: COLOR,
  piece?: PIECE_TYPE,
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

  interface checkMoveLegalityProps{
    thisPieceType: PIECE_TYPE,
    thisPieceColor: COLOR,
    currentColumn: COLUMN_LETTER,
    currentRow: ROW_NUMBER,
    destinationColumn: COLUMN_LETTER,
    destinationRow: ROW_NUMBER,
    canCapture: boolean
  }

  interface checkKingSafetyProps{
    kingColor: COLOR,
    checkCol?: COLUMN_LETTER,
    checkRow?: ROW_NUMBER
  }

  const checkKingSafety = (props : checkKingSafetyProps) : boolean => {

    const kingSquare = squares.find(s => s.piece === PIECE_TYPE.KING && s.pieceColor === props.kingColor)

    const oldKingSquare = calcSquareNum({ column: kingSquare.column, row: kingSquare.row })
    let kingCol : number
    props.checkCol ? kingCol = props.checkCol : kingCol = kingSquare.column as number
    let kingRow : number
    props.checkRow ? kingRow = props.checkRow : kingRow = kingSquare.row as number
    let oppositeColor
    props.kingColor === COLOR.BLACK ? oppositeColor = COLOR.WHITE : oppositeColor = COLOR.BLACK

    // check for pawns
    let rowToCheck = kingRow + 1 // defaults to white
    if (props.kingColor === COLOR.BLACK){
      rowToCheck = kingRow - 1
    }
    for (let i = kingCol - 1; i <= kingCol + 1; i++){
      if (i > 0 && i <= NUM_COLUMNS && i !== kingCol){
        const currSquare = calcSquareNum({ column: i, row: rowToCheck })
        if (squares[currSquare].piece === PIECE_TYPE.PAWN && squares[currSquare].pieceColor === oppositeColor){
          return false
        }
      }
    }

    //console.log("no pawns")

    // check for rooks
    // check left
    for (let i = kingCol - 1; i > 0; i--) {
      const currentSquare = calcSquareNum({ column: i, row: kingRow })
      //console.log("square num is: ", currentSquare)
      if ((squares[currentSquare].piece) && (currentSquare !== oldKingSquare)){
        if ((squares[currentSquare].pieceColor === oppositeColor) && 
        (squares[currentSquare].piece === PIECE_TYPE.ROOK || squares[currentSquare].piece === PIECE_TYPE.QUEEN)){
          return(false)
        } else {
          break
        }
      }
    }
    // check right
    for (let i = kingCol + 1; i <= NUM_COLUMNS; i++) {
      const currentSquare = calcSquareNum({ column: i, row: kingRow })
      //console.log("square num is: ", currentSquare)
      if ((squares[currentSquare].piece) && (currentSquare !== oldKingSquare)){
        if ((squares[currentSquare].pieceColor === oppositeColor) && 
        (squares[currentSquare].piece === PIECE_TYPE.ROOK || squares[currentSquare].piece === PIECE_TYPE.QUEEN)){
          return(false)
        } else {
          break
        }
      }
    }
    // check down
    for (let i = kingRow - 1; i > 0; i--) {
      const currentSquare = calcSquareNum({ column: kingCol, row: i })
      //console.log("square num is: ", currentSquare)
      if ((squares[currentSquare].piece) && (currentSquare !== oldKingSquare)){
        if ((squares[currentSquare].pieceColor === oppositeColor) && 
        (squares[currentSquare].piece === PIECE_TYPE.ROOK || squares[currentSquare].piece === PIECE_TYPE.QUEEN)){
          return(false)
        } else {
          break
        }
      }
    }
    // check up
    for (let i = kingRow + 1; i <= NUM_ROWS; i++) {
      const currentSquare = calcSquareNum({ column: kingCol, row: i })
      //console.log("square num is: ", currentSquare)
      if ((squares[currentSquare].piece) && (currentSquare !== oldKingSquare)){
        if ((squares[currentSquare].pieceColor === oppositeColor) && 
        (squares[currentSquare].piece === PIECE_TYPE.ROOK || squares[currentSquare].piece === PIECE_TYPE.QUEEN)){
          return(false)
        } else {
          break
        }
      }
    }

    //console.log("no rooks")

    // check for bishops
    // check up right
    let columnItr = kingCol + 1
    for (let i = kingRow + 1; i <= NUM_ROWS; i++) {
      if (columnItr <= NUM_COLUMNS){
        const currentSquare = calcSquareNum({ column: columnItr, row: i })
        //console.log("square num is: ", currentSquare)
        if ((squares[currentSquare].piece) && (currentSquare !== oldKingSquare)){
          if ((squares[currentSquare].pieceColor === oppositeColor) && 
            (squares[currentSquare].piece === PIECE_TYPE.BISHOP || squares[currentSquare].piece === PIECE_TYPE.QUEEN)){
            return(false)
          } else {
            break
          }
        }
      } else {
        break
      }
      columnItr = columnItr + 1
    }

    // check up left
    columnItr = kingCol - 1
    for (let i = kingRow + 1; i <= NUM_ROWS; i++) {
      if (columnItr > 0){
        const currentSquare = calcSquareNum({ column: columnItr, row: i })
        //console.log("square num is: ", currentSquare)
        if ((squares[currentSquare].piece) && (currentSquare !== oldKingSquare)){
          if ((squares[currentSquare].pieceColor === oppositeColor) && 
            (squares[currentSquare].piece === PIECE_TYPE.BISHOP || squares[currentSquare].piece === PIECE_TYPE.QUEEN)){
            return(false)
          } else {
            break
          }
        }
      } else {
        break
      }
      columnItr = columnItr - 1
    }

    // check down left
    columnItr = kingCol - 1
    for (let i = kingRow - 1; i > 0; i--) {
      if (columnItr > 0){
        const currentSquare = calcSquareNum({ column: columnItr, row: i })
        //console.log("square num is: ", currentSquare)
        if ((squares[currentSquare].piece) && (currentSquare !== oldKingSquare)){
          if ((squares[currentSquare].pieceColor === oppositeColor) && 
                (squares[currentSquare].piece === PIECE_TYPE.BISHOP || squares[currentSquare].piece === PIECE_TYPE.QUEEN)){
            return(false)
          } else {
            break
          }
        }
      } else {
        break
      }
      columnItr = columnItr - 1
    }

    // check down right
    columnItr = kingCol + 1
    for (let i = kingRow - 1; i > 0; i--) {
      if (columnItr <= NUM_COLUMNS){
        const currentSquare = calcSquareNum({ column: columnItr, row: i })
        //console.log("square num is: ", currentSquare)
        if ((squares[currentSquare].piece) && (currentSquare !== oldKingSquare)){
          if ((squares[currentSquare].pieceColor === oppositeColor) && 
                      (squares[currentSquare].piece === PIECE_TYPE.BISHOP || squares[currentSquare].piece === PIECE_TYPE.QUEEN)){
            return(false)
          } else {
            break
          }
        }
      } else {
        break
      }
      columnItr = columnItr + 1
    }

    //console.log("no bishops")

    // check for king
    for (let i = kingCol - 1; i <= kingCol + 1; i++){
      for (let j = kingRow - 1; j <= kingRow + 1; j++){
        if (kingCol > 0 && kingRow > 0){
          if (kingRow <= NUM_COLUMNS && kingRow <= NUM_ROWS){
            const currentSquare = calcSquareNum({ column: i, row: j })
            if (squares[currentSquare].piece === PIECE_TYPE.KING && currentSquare !== oldKingSquare){
              console.log("King found at currentSquare")
              return false
            }
          }
        }
      }
    }

    return true
  }
  
  // check for knights

  const checkMoveLegality = (props : checkMoveLegalityProps): boolean => {
    const checkDiagonalMovement = () => {
      const rowChange = props.destinationRow - props.currentRow
      const colChange = props.destinationColumn - props.currentColumn
      if (Math.abs(rowChange) === Math.abs(colChange)){
        let incrementColumnBy = 1
        if (colChange < 0){
          incrementColumnBy = -1
        }
        let incrementRowBy = 1
        if (rowChange < 0){
          incrementRowBy = -1
        }
        let colItr = props.currentColumn + incrementColumnBy
        let rowItr = props.currentRow + incrementRowBy
        while (colItr !== props.destinationColumn as number){
          const checkSquare = calcSquareNum({ row: rowItr, column: colItr })
          if (squares[checkSquare].piece) {
            return(false)
          }
          colItr = colItr + incrementColumnBy
          rowItr = rowItr + incrementRowBy
        }
        return(true)
      }
    }

    const checkOrthogonalMovement = () => {
      if (props.destinationColumn === props.currentColumn){
        let incrementBy = 1
        if (props.destinationRow < props.currentRow){
          incrementBy = -1
        }
        let rowItr = props.currentRow + incrementBy
        while (rowItr !== props.destinationRow as number){
          const checkSquare = calcSquareNum({ row: rowItr, column: props.destinationColumn })
          if (squares[checkSquare].piece) {
            return(false)
          }
          rowItr = rowItr + incrementBy
        }
        return(true)
      }
      if (props.destinationRow === props.currentRow){
        let incrementBy = 1
        if (props.destinationColumn < props.currentColumn){
          incrementBy = -1
        }
        let colItr = props.currentColumn + incrementBy
        while (colItr !== props.destinationColumn as number){
          const checkSquare = calcSquareNum({ row: props.destinationRow, column: colItr })
          if (squares[checkSquare].piece) {
            return(false)
          }
          colItr = colItr + incrementBy
        }
        return(true)
      }
      return(false)
    }

    switch (props.thisPieceType){
    case PIECE_TYPE.PAWN:
      if (props.thisPieceColor === COLOR.WHITE){
        if (props.destinationColumn === props.currentColumn && 
          (props.destinationRow as number === props.currentRow + 1) || 
          (props.currentRow as number === 2 && props.destinationRow as number === props.currentRow + 2)){
          return(true)
        }
        if (props.destinationColumn as number === props.currentColumn - 1 || props.destinationColumn as number === props.currentColumn + 1){
          if (props.canCapture){
            return(true)
          }
        }
      }
      if (props.thisPieceColor === COLOR.BLACK){
        if (props.destinationColumn === props.currentColumn && 
          (props.destinationRow as number === props.currentRow - 1) || 
          (props.currentRow as number === 7 && props.destinationRow as number === props.currentRow - 2)){
          return(true)
        }
        if (props.destinationColumn as number === props.currentColumn - 1 || props.destinationColumn as number === props.currentColumn + 1){
          if (props.canCapture){
            return(true)
          }
        }
      }
      return(false)
    case PIECE_TYPE.ROOK:{
      const canMoveOrthogonal = checkOrthogonalMovement()
      return (canMoveOrthogonal)
    }
    case PIECE_TYPE.KNIGHT:
      if ((props.destinationColumn as number === props.currentColumn + 1) || (props.destinationColumn as number === props.currentColumn - 1)){
        if ((props.destinationRow as number === props.currentRow + 2) || (props.destinationRow as number === props.currentRow - 2)){
          return true
        }
      }
      if ((props.destinationRow as number === props.currentRow + 1) || (props.destinationRow as number === props.currentRow - 1)){
        if ((props.destinationColumn as number === props.currentColumn + 2) || (props.destinationColumn as number === props.currentColumn - 2)){
          return true
        }
      }
      return(false)
    case PIECE_TYPE.BISHOP: {
      const canMoveDiagonal = checkDiagonalMovement()
      return(canMoveDiagonal)
    }
    case PIECE_TYPE.QUEEN: {
      const canMoveOrthogonal = checkOrthogonalMovement()
      if (canMoveOrthogonal){
        return(true)
      }
      const canMoveDiagonal = checkDiagonalMovement()
      if (canMoveDiagonal){
        return(true)
      }
      return(false)
    }
    case PIECE_TYPE.KING: {
      if (props.destinationColumn == props.currentColumn || props.destinationColumn as number == props.currentColumn + 1
        || props.destinationColumn as number == props.currentColumn - 1){
        if (props.destinationRow == props.currentRow || props.destinationRow as number == props.currentRow + 1
          || props.destinationRow as number == props.currentRow - 1){
          const kingIsSafe = checkKingSafety({ kingColor: props.thisPieceColor, checkCol: props.destinationColumn, checkRow: props.destinationRow })
          if (kingIsSafe){
            return true
          } 
        }
      }
      return(false)
    }
    default:
      return(true)
    }
    
  }


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
          canCapture: trueIfCanCapture })){
          
          //if (checkKingSafety({ kingColor: active.data.current.color })){
          const originSquareNum = calcSquareNum({ row: originRowNum, column: originColNum })
          newSquares[originSquareNum] = { ...squares[originSquareNum], piece: undefined, pieceColor: undefined }
          newSquares[destinationSquareNum] = { ...squares[destinationSquareNum], piece: active.data.current.type, pieceColor: active.data.current.color }
          setSquares(newSquares)
          //}
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


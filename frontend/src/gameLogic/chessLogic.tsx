import { COLOR, PIECE_TYPE, COLUMN_LETTER, ROW_NUMBER, ChessSquare } from "../types/chess" 

const NUM_ROWS = 8
const NUM_COLUMNS = 8

interface calcSquareNumProps{
  column: number,
  row: number
}

export const calcSquareNum = (props : calcSquareNumProps) => {
  if (props.column > 0 && props.column <= NUM_COLUMNS && props.row > 0 && props.row <= NUM_ROWS){
    let squareNum = props.column - 1
    squareNum = squareNum + ((props.row - 1) * NUM_COLUMNS)
    return squareNum
  }
  return NaN
}

interface checkKingSafetyProps{
  kingColor: COLOR,
  squaresToCheck: ChessSquare[]
}

export const checkKingSafety = (props : checkKingSafetyProps) : boolean => {

  const kingSquare = props.squaresToCheck.find(s => s.piece === PIECE_TYPE.KING && s.pieceColor === props.kingColor)
  const squares = props.squaresToCheck

  console.log("Squares is: ", squares)

  const oldKingSquare = calcSquareNum({ column: kingSquare.column, row: kingSquare.row })
  const kingCol = kingSquare.column as number
  const kingRow = kingSquare.row as number
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
          if (!isNaN(currentSquare) && squares[currentSquare].piece === PIECE_TYPE.KING && currentSquare !== oldKingSquare){
            return false
          }
        }
      }
    }
  }

  // check for knights
  const squaresToCheck = [
    calcSquareNum({ column: kingCol + 1, row: kingRow + 2 }),
    calcSquareNum({ column: kingCol + 2, row: kingRow + 1 }),
    calcSquareNum({ column: kingCol + 2, row: kingRow - 1 }),
    calcSquareNum({ column: kingCol + 1, row: kingRow - 2 }),
    calcSquareNum({ column: kingCol - 1, row: kingRow + 2 }),
    calcSquareNum({ column: kingCol - 2, row: kingRow + 1 }),
    calcSquareNum({ column: kingCol - 2, row: kingRow - 1 }),
    calcSquareNum({ column: kingCol - 1, row: kingRow - 2 }),
  ]

  for (let i = 0; i < squaresToCheck.length; i++ ){
    const squareNum = squaresToCheck[i]
    //console.log("Checking: ", squareNum)
    if (!isNaN(squareNum)){
      if(squares[squareNum].piece === PIECE_TYPE.KNIGHT && squares[squareNum].pieceColor === oppositeColor){
        //console.log("returning false")
        return false
      }
    }
  }

  return true
}

interface checkMoveLegalityProps{
  thisPieceType: PIECE_TYPE,
  thisPieceColor: COLOR,
  currentColumn: COLUMN_LETTER,
  currentRow: ROW_NUMBER,
  destinationColumn: COLUMN_LETTER,
  destinationRow: ROW_NUMBER,
  canCapture: boolean, 
  squares: ChessSquare[]
}

export const checkMoveLegality = (props : checkMoveLegalityProps): boolean => {
  const squares = props.squares

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
        return true
      }
    }
    return(false)
  }
  default:
    return(true)
  }
  
}

interface validateCheckmateProps{
  thisKingType: PIECE_TYPE, 
  squares: ChessSquare[]
}

export const validateCheckmate = (props : validateCheckmateProps) => {
  
}
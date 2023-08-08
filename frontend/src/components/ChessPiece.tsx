import React, { ReactNode } from "react"
import styled from "styled-components"
import { useDraggable } from "@dnd-kit/core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChessKing, faChessQueen, faChessRook, faChessBishop, faChessKnight, faChessPawn } from "@fortawesome/free-solid-svg-icons"
import { COLOR, PIECE_TYPE, COLUMN_LETTER, ROW_NUMBER } from "../types/chess" 

interface PieceContainerProps{
  $isFlipped: boolean,
  $isDraggable: boolean
}

const PieceContainer = styled.div<PieceContainerProps>`
  touch-action: none;
  width: min-content;
  font-size: 50px;
  place-self: center;
  
  position: relative;
  z-index: 100;
  ${props =>
    props.$isDraggable ?
      `&: hover {
        cursor: pointer;
      }`
      : null
}

  ${props => props.$isFlipped ? "transform: rotate(180deg);" : null}
`

const DraggableContainer = styled.div`
  place-self: center;
`

interface DraggablePieceProps {
  id: string,
  children: ReactNode,
  color: COLOR,
  type: PIECE_TYPE,
  column: COLUMN_LETTER,
  row: ROW_NUMBER,
  isFlipped: boolean,
  isDraggable: boolean
}

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
  let translateString = ""
  if (transform){
    props.isFlipped
      ? translateString = `translate3d(${transform.x * -1}px, ${transform.y * -1}px, 0)` 
      : translateString = `translate3d(${transform.x}px, ${transform.y}px, 0)`
  }
  //console.log("props.isFlipped? ", props.isFlipped)
  const style = transform ? {
    transform: translateString,
    zIndex: 200
  }
    : undefined;

  if (props.isDraggable){
    return (
      <DraggableContainer ref={setNodeRef} style={style} {...listeners} {...attributes}>
        {props.children}
      </DraggableContainer>
    )
  }
  return(
    <>
      {props.children}
    </>
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
  row: ROW_NUMBER,
  playerColor: COLOR
}

const ChessPiece = (props : ChessPieceProps) => {
  const isFlipped = (props.playerColor === COLOR.WHITE) ? true : false
  const isDraggable = (props.playerColor === props.color)
  let showColor : string = ""
  props.color === COLOR.WHITE ?  showColor = "white" : showColor = "black"

  return(
    <DraggablePiece isDraggable={isDraggable} id={props.id} type={props.type} color={props.color} column={props.column} row={props.row} isFlipped={isFlipped} >
      <PieceContainer $isFlipped={isFlipped} $isDraggable={isDraggable} >
        <span style={{ color: showColor }}>
          <DisplayPiece type={props.type}/>
        </span>
      </PieceContainer>
    </DraggablePiece>
  )
}


export default ChessPiece
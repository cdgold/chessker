import React, { ReactNode } from "react"
import styled from "styled-components"
import { useDraggable } from "@dnd-kit/core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChessKing, faChessQueen, faChessRook, faChessBishop, faChessKnight, faChessPawn } from "@fortawesome/free-solid-svg-icons"
import { COLOR, PIECE_TYPE, COLUMN_LETTER, ROW_NUMBER } from "../types/chess" 


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


export default ChessPiece
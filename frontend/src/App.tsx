import React from "react"
import styled from "styled-components"
import ChessBoard from "./components/ChessBoard"

const BoardContainer = styled.div`
  height: 600px;
  width: 600px;
`

function App() {
  return (
    <>
      <div>
        Board below
      </div>
      <BoardContainer>
      <ChessBoard />
      </BoardContainer>
    </>
  )
}

export default App

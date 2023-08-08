import React, { useEffect, useState } from "react"
import styled from "styled-components"
import ChessBoard from "./components/ChessBoard"
import { useSocket } from "./hooks/useSocket"
import { Socket } from "socket.io-client"
import { COLOR } from "./types/chess"

interface ServerToClientEvents {
  set_player_color: () => void;
}

const BoardContainer = styled.div`
  height: 600px;
  width: 600px;
`

const NewGameButton = styled.button`

`

const API_URL = "localhost:3003"

/*
const socket : Socket<ServerToClientEvents, ClientToServerEvents> = io()
socket.connect(API_URL)
*/
function App() {
  const [socketConnection, setSocketConnection] = useState<Socket | undefined>(undefined)
  const [clientID, setClientID] = useState<string | undefined>(undefined)
  const [roomID, setRoomID] = useState<string | undefined>(undefined)
  const [joinRoomInput, setJoinRoomInput] = useState<string>("")
  const [chessColor, setChessColor] = useState<COLOR>(COLOR.BLACK)
  
  const socket = useSocket(`ws://${API_URL}`, {
    reconnectionAttempts: 4,
    reconnectionDelay: 3000,
    autoConnect: false
  })

  useEffect(() => {

  }, [])

  const connect = () => {
    socket.connect()
    setSocketConnection(socket)
    startEventListeners()
    sendHandshake()
  };

  const startEventListeners = () => {
    socket.io.on("reconnect", (attempt) => {
      console.info("attempting reconnect with attempt ", attempt)
    })

    socket.io.on("reconnect_attempt", (attempt) => {
      console.info("reconnection attempt number ", attempt)
    })

    socket.io.on("reconnect_error", (error) => {
      console.info("reconecction error ", error)
    })

    socket.io.on("reconnect_failed", () => {
      window.alert("Error in connection attempt.")
    })

    socket.on("set_player_color", (color: string) => {
      setChessColor(color as COLOR)
    })
  }

  const sendHandshake = () => {
    console.log("Sending handshake")

    socket.emit("handshake", (clientID: string, roomID: string) => {
      console.log("handshake message received")
      setClientID(clientID)
      setRoomID(roomID)
    })
  }

  const joinRoom = () => {
    console.log("attempting room join")

    socket.emit("join_room", joinRoomInput, (error: string) => {
      if (error === "") {
        console.log("Joined room: ", joinRoomInput)
        setRoomID(joinRoomInput)
      }
      else {
        console.log("failed because: ", error)
      }
    })

  }

  //console.log("socket is now: ", socket)

  return (
    <>
      <div>
        Board below
      </div>
      <div>
        client ID is: {clientID} <br></br>
        invite other player with: {roomID} <br></br>
        or join other player's game with: 
        <input 
          value={joinRoomInput}
          onChange={(e) => {setJoinRoomInput(e.target.value)}}>  
        </input>
        <button onClick={() => { joinRoom() }}> join </button>
      </div>
      <BoardContainer>
        <ChessBoard playerColor={chessColor} />
      </BoardContainer>
      {socketConnection === undefined || socketConnection.connected === false ?
        <NewGameButton onClick={() => connect()}> Connect to server </NewGameButton>
        : null}
    </>
  )
}

export default App

/* eslint-disable no-unused-vars */
import { ManagerOptions, Socket, SocketOptions, io } from "socket.io-client"
import { useRef, useEffect } from "react"
import { COLOR } from "../types/chess";

interface ServerToClientEvents {
  set_player_color: (color: COLOR) => void;
}

interface ClientToServerEvents {
  handshake: (callback: (clientID: string, roomID: string) => void) => void;
  join_room: (joinRoomInput: string, callback: (clientID: string, roomID: string) => void) => void;
}

export const useSocket = (
  uri: string, 
  opts?: Partial<ManagerOptions & SocketOptions>
) => {
  const declaredIo: Socket<ServerToClientEvents, ClientToServerEvents> = io(uri, opts)
  const { current: socket } = useRef(declaredIo)

  useEffect(() => {
    return () => {
      if (socket) socket.close();
    }
  }, [socket])

  return socket
}
import { ManagerOptions, SocketOptions, io } from "socket.io-client"
import { useRef, useEffect } from "react"

export const useSocket = (
  uri: string, 
  opts?: Partial<ManagerOptions & SocketOptions>
) => {
  const { current: socket } = useRef(io(uri, opts))

  useEffect(() => {
    return () => {
      if (socket) socket.close();
    }
  }, [socket])

  return socket
}
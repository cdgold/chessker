import React, { PropsWithChildren, useReducer, useState } from "react"
import { SocketContextProvider, SocketReducer, defaultSocketContextState } from "./Context"

export interface ISocketComponentProps extends PropsWithChildren {}

const SocketContextComponent: React.FunctionComponent<ISocketComponentProps> = (props) => {
  const { children } = props

  const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState)
  const [loading, setLoading] = useState<boolean>(true)

  if (loading) return(<p> Setting up socket... </p>)
  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  )
}

export default SocketContextComponent 
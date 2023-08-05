import { Server as HTTPServer } from "http"
import { Socket, Server } from "socket.io"
import crypto from "crypto"

// get room number based on client (maybe add to clientinfo? (but then redundant info))

interface ClientInfo {
  socketID: string
}

interface GameInfo {
  white: string,
  black: string | undefined
}

export class ServerSocket {
  public static instance: ServerSocket
  public io: Server
  
  public clients: { [clientID: string]: ClientInfo }
  public games: { [roomID: string]: GameInfo }

  constructor(server: HTTPServer) {
    ServerSocket.instance = this
    this.clients = {}
    this.games = {}
    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: "*"
      }
    })

    this.io.on("connect", this.StartListeners)

    console.info("Socket IO started.")
    }

    StartListeners = (socket: Socket) => {
      console.info("Message received from " + socket.id)
      
      socket.on("handshake", (callback: (clientID: string, roomID: string | undefined) => void) => {
        console.log("handshake received from " + socket.id)

        const reconnected = Object.keys(this.clients).includes(socket.id)

        if (reconnected){
          const clientID = this.getClientIDFromSocketID(socket.id)

          if (clientID) {
            console.info("sending callback for reconnect")
            // const roomID = this.clients[clientID].roomNumber
            callback(clientID, roomID)
            return
          }
        }

        const clientID = crypto.randomBytes(12).toString("hex");
        const roomID = crypto.randomBytes(6).toString("hex");

        socket.join(roomID)

        this.games[roomID] = { white: clientID, black: undefined}
        this.clients[clientID] = { socketID: socket.id }

        console.info("sending callback for reconnect")
        callback(clientID, roomID)
        return
      })

      socket.on("disconnect", () => {
        console.info("Disconnect received from ", socket.id)

        if (this.clients[socket.id]) {
          delete this.clients[socket.id]
          // TODO: send message to room saying client disconnected
        }
      })

      socket.on("join_room", (payload: string, callback: (error: string) => void) => {
        console.log("got join room request with payload: ", payload)
        console.log("all rooms is:", this.io.of("/").adapter.rooms)
        const room = this.io.of("/").adapter.rooms.get(payload)
        if (room === undefined){
          callback("Room ID not found.")
          return
        }
        if (room.size === 2){
          callback("Player already in match.")
          return
        }
    
        console.info("Socket id ", socket.id, " is joining room: ", payload)
        this.games[payload] = { ...this.games[payload], black: this.getClientIDFromSocketID(socket.id) }
        socket.join(payload)
        callback("")
      })
    }

    getClientIDFromSocketID = (id : string) => {
      return Object.keys(this.clients).find((clientID) => this.clients[clientID].socketID == id)
    }

    getRoomIDFromSocketID = (id: string) => {
      return Object.keys(this.games).find((roomID) => this.clients[clientID].socketID == id)
    }
  }

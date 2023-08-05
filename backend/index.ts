// 
// io.in(theSocketId).socketsJoin("room1");

// watch CORS!!

const BASE_URL = "http://localhost:3000"

console.log("test")

const express = require("express")
const app = express()
const http  = require("http")
const cors = require("cors")
const ServerSocket = require("./socket")

app.use(cors())

const server = http.createServer(app)
new ServerSocket.ServerSocket(server)

app.use((req : any, res : any, next : any) => {
  console.info(`METHOD: ${req.method}`)
  console.info(`URL: ${req.url}`)
  console.info(`IP: ${req.socket.remoteAddress}`)
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/*
app.get('/connect', (req : any, res : any) => {

});
*/

const port = process.env.PORT || 3003
server.listen(port)
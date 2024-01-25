import express, { NextFunction, Request, Response } from 'express'
import 'dotenv/config'
import cors from 'cors'
import routes from './routes'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const PORT = process.env.PORT ?? 3232

const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    io.emit('user-disconnected', socket.id)
  })

  socket.on('user', (message) => {
    io.emit('users-positions', { ...message, id: socket.id })
  })

  io.emit('my-user', socket.id)
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((request: Request, response: Response, next: NextFunction) => {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Headers', '*')
  response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')

  app.use(cors())

  next()
})

app.use(routes)

app.get('/', (request: Request, response: Response) => {
  return response.send({ message: 'Welcome to financy backend. V1.0' })
})

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `)
})

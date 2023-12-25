import express, { NextFunction, Request, Response } from 'express'
import 'dotenv/config'
import { prismaClient } from './database/prisma-client'
import cors from 'cors'
import { formatValue } from './util/format-value'
import { sign } from 'jsonwebtoken'
import { Auth } from './middlewares/auth-middleware'
import { compare } from 'bcryptjs'
import routes from './routes'

const app = express()
const PORT = process.env.PORT ?? 3232

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `)
})

import express, { type NextFunction, type Request, type Response } from 'express'
import dotenv from 'dotenv'
import { BusinessError } from '../domain/errors/business-error'

dotenv.config()

const app = express()

app.use(express.json())

// Registre as rotas acima deste middleware.
app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof BusinessError) {
    return response.status(error.statusCode).json({
      error: error.name,
      message: error.message,
    })
  }

  console.error(error)

  return response.status(500).json({
    error: 'InternalServerError',
    message: 'Erro interno do servidor.',
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

export { app }
import express from 'express'
import dotenv from 'dotenv'
import { cartRoutes } from '../infra/http/routes/cart-routes'
import { orderRoutes } from '../infra/http/routes/order-routes'
import { productRoutes } from '../infra/http/routes/product-routes'
import { userRoutes } from '../infra/http/routes/user-routes'
import { errorMiddleware } from '../infra/http/middlewares/error-middleware'

dotenv.config()

const app = express()

app.use(express.json())

app.use(userRoutes)
app.use(productRoutes)
app.use(cartRoutes)
app.use(orderRoutes)

app.use(errorMiddleware)

export { app }

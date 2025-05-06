/**
 * Entry point of the application.
 * 
 * Sets up the Express server, connects to the database, and configures
 * middleware and route handlers for categories and products.
 */

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectToDatabase } from './config/db'
import categoryRouter from './routes/categories'
import productRouter from './routes/products'

const app = express()

app.use(express.json())
app.use(cors())

app.use('/categories', categoryRouter)
app.use('/products', productRouter)

connectToDatabase()

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
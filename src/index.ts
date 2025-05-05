// TRANSLATED

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectToDatabase } from './config/db'
import categoryRouter from './routes/categories'
import productRouter from './routes/products'

const app = express()

// Middleware
app.use(express.json()) // This specific middleware parses JSON string to Javascript Object
app.use(cors())        // This makes the Express server except request from other domains

// Routes
app.use('/categories', categoryRouter)
app.use('/products', productRouter)

// Connect To DB
connectToDatabase()
// Start the express server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
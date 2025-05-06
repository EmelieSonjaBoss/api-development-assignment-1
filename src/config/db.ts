/**
 * Handles the database connection pool setup using MySQL2 with promises.
 * 
 * Exports a connection pool (db) and a utility function (connectToDatabase)
 * to test the connection on application startup.
 */

import mysql from 'mysql2/promise'
import { env } from './env'

/**
 * A connection pool to the MySQL database.
 * 
 * The pool is configured using environment variables.
 */
export const db = mysql.createPool({
  host:     env.DB_HOST,
  user:     env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  port:     env.DB_PORT,
})

/**
 * Tests the database connection by attempting to get a connection from the pool.
 * 
 * Logs a success message if connected, or logs an error message if the connection fails.
 */
export const connectToDatabase = async () => {
  try {
    await db.getConnection();
    console.log('Connected to DB')
  } catch (error: unknown) {
    console.log('Error connecting to DB: ' + error)
  }
}
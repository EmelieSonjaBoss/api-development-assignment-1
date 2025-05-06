/**
 * Controller for handling product-related operations.
 * @module productsController
 */

import { Request, Response } from "express"
import { db } from "../config/db"
import { ResultSetHeader } from "mysql2"
import { IProductDBResponse } from "../models/IProductDBResponse"

/**
 * Fetches all products.
 * 
 * @param req - The request object.
 * @param res - The response object that sends the result.
 * @returns A JSON response with all products.
 */
export const fetchAllProducts = async (req: Request, res: Response) => {
  try {
    const sql = 'SELECT * FROM products'
    const [rows] = await db.query<IProductDBResponse[]>(sql)
    
    res.json(rows)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
}


/**
 * Fetches a single product by its ID.
 * 
 * @param req - The request object containing the product ID.
 * @param res - The response object that sends the result.
 * @returns A JSON response with the product or a 404 error if not found.
 */
export const fetchProduct = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
    const sql = 'SELECT * FROM products WHERE product_id = ?'
    const [rows] = await db.query<IProductDBResponse[]>(sql, [id])
    const product = rows[0]

    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }

    res.json(product)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
}


/**
 * Fetches all products for a specific category
 * @param req 
 * @param res 
 */
export const fetchProductsByCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.id

  try {
    const sql = `
      SELECT * FROM products
      WHERE category_id = ?
    `
    const [rows] = await db.query<IProductDBResponse[]>(sql, [categoryId])

    if (rows.length === 0) {
      res.status(404).json({ message: `No products found for category with id ${categoryId}` })
      return
    }

    res.json(rows)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
}



/**
 * Creates a new product.
 * 
 * @param req - The request object containing the product data.
 * @param res - The response object that sends the result.
 * @returns A JSON response with the status and created product ID.
 */
export const createProduct = async (req: Request, res: Response) => {
  const { product_title, product_description, product_stock, product_price, product_img, category_id } = req.body

  if (!product_title || !product_description || !product_stock || !product_price || !product_img || !category_id) {
    res.status(400).json({ error: 'All fields are required' })
    return
  }

  try {
    const sql = `
      INSERT INTO products (product_title, product_description, product_stock, product_price, product_img, category_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    const [result] = await db.query<ResultSetHeader>(sql, [product_title, product_description, product_stock, product_price, product_img, category_id])

    res.status(201).json({ message: 'Product created', id: result.insertId })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
}


/**
 * Updates an existing product by its ID.
 * 
 * @param req - The request object containing the updated product data and ID.
 * @param res - The response object that sends the result.
 * @returns A JSON response with a success message or a 404 error if not found.
 */
export const updateProduct = async (req: Request, res: Response) => {
  const id = req.params.id
  const { product_title, product_description, product_stock, product_price, product_img, category_id } = req.body

  if (!product_title || !product_description || !product_stock || !product_price || !product_img || !category_id) {
    res.status(400).json({ error: 'All fields are required' })
    return
  }

  try {
    const sql = `
      UPDATE products
      SET product_title = ?, product_description = ?, product_stock = ?, product_price = ?, product_img = ?, category_id = ?
      WHERE product_id = ?
    `
    const [result] = await db.query<ResultSetHeader>(sql, [product_title, product_description, product_stock, product_price, product_img, category_id, id])

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Product not found' })
      return
    }

    res.json({ message: 'Product updated' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
}


/**
 * Deletes a product by its ID.
 * 
 * @param req - The request object containing the product ID.
 * @param res - The response object that sends the result.
 * @returns A JSON response with a success message or a 404 error if not found.
 */
export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
    const sql = 'DELETE FROM products WHERE product_id = ?'
    const [result] = await db.query<ResultSetHeader>(sql, [id])

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Product not found' })
      return
    }

    res.json({ message: 'Product deleted' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
}
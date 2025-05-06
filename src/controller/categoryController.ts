/**
 * Controller for handling category-related operations.
 * @module categoryController
 */

import { Request, Response } from "express"
import { db } from "../config/db"
import { ResultSetHeader, RowDataPacket } from "mysql2"
import { ICategoryDBResponse } from "../models/ICategoryDBResponse"


/**
 * Fetches all categories together.
 * @param req - The request object.
 * @param res - The response object.
 */
export const fetchAllCategories = async (req: Request, res: Response) => {
  try {
    const sql = 'SELECT * FROM categories'
    const [rows] = await db.query<RowDataPacket[]>(sql)
    res.json(rows)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}


/**
 * Fetches a single category along with the products associated with it.
 * @param req - The request object, containing the category ID in the route parameters.
 * @param res - The response object, used to return the category and associated products or errors.
 * @returns A JSON response with the category details and products, or an error message if not found.
 */
export const fetchCategory = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
   
    const sql = `
      SELECT 
        c.category_id AS category_id,
        c.category_name AS category_name,
        p.product_id AS product_id,
        p.product_title AS product_title,
        p.product_description AS product_description,
        p.product_stock AS product_stock,
        p.product_price AS product_price,
        p.product_img AS product_img,
        p.product_created AS product_created,
        p.category_id AS category_id
      FROM categories c
      LEFT JOIN products p ON c.category_id = p.category_id
      WHERE c.category_id = ?
    `
    const [rows] = await db.query<ICategoryDBResponse[]>(sql, [id])
    const category = rows[0]
    if (!category) {
      res.status(404).json({message: 'Category not found'})
      return
    }
    res.json(formatCategory(rows))
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}

// Helper function to format the category and its products into a specific response format.
const formatCategory = (rows: ICategoryDBResponse[]) => ({
  id:         rows[0].category_id,
  content:    rows[0].category_name,
  products: rows.map((row) => ({
      id:        row.product_id,
      title:     row.product_title,
      description: row.product_description,
      stock:     row.product_stock,
      price:     row.product_price,
      img:       row.product_img,
      created:   row.product_created,
      category:  row.product_category_id
  }))
})


/**
 * Creates a new category with the given name.
 * @param req - The request object, containing the category name in the body.
 * @param res - The response object, used to return the created category or errors.
 * @returns A JSON response with the created category ID, or an error message.
 */
export const createCategory = async (req: Request, res: Response) => {
  const content = req.body.content;
  if (content === undefined) {
    res.status(400).json({error: 'Content is required'}) 
    return; 
  }

  try {
    const sql = `
      INSERT INTO categories (category_name)
      VALUES (?)
    `
    const [result] = await db.query<ResultSetHeader>(sql, [content])
    res.status(201).json({message: 'Category created', id: result.insertId})
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}


/**
 * Updates an existing category's name.
 * @param req - The request object, containing the category ID in the route parameters and the new name in the body.
 * @param res - The response object, used to return the updated category or errors.
 * @returns A JSON response confirming the update, or an error message if the category is not found.
 */
export const updateCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  const content = req.body.content;

  if (content === undefined) {
    res.status(400).json({error: 'Content is required'})
    return;
  }

  try {
    const sql = `
      UPDATE categories
      SET category_name = ?
      WHERE category_id = ?
    `
    const [result] = await db.query<ResultSetHeader>(sql, [content, id])
    if (result.affectedRows === 0) {
      res.status(404).json({message: 'Category not found'})
      return;
    }
    res.json({message: 'Category updated'})
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}


/**
 * Deletes a category by its ID.
 * @param req - The request object, containing the category ID in the route parameters.
 * @param res - The response object, used to return a success message or errors.
 * @returns A JSON response confirming the deletion, or an error message if the category is not found.
 */
export const deleteCategory = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
    const sql = `
      DELETE FROM categories
      WHERE category_id = ?
    `
    const [result] = await db.query<ResultSetHeader>(sql, [id])
    if (result.affectedRows === 0) {
      res.status(404).json({message: 'Category not found'})
      return;
    }
    res.json({message: 'Category deleted'})
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}

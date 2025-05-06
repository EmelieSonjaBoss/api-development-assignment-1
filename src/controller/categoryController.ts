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
 * Fetches a single category by its ID.
 * @param req - The request object, containing the category ID in the route parameters.
 * @param res - The response object, used to return the category or an error.
 * @returns A JSON response with the category details and products, or an error message if not found.
 */
export const fetchCategory = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
    const sql = `
      SELECT 
        category_id AS category_id,
        category_name AS category_name
      FROM categories
      WHERE category_id = ?
    `
    const [rows] = await db.query<ICategoryDBResponse[]>(sql, [id])
    const category = rows[0]

    if (!category) {
      res.status(404).json({ message: 'Category not found' })
      return
    }

    // Direct response, same style as fetchProduct
    res.json(category)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
}


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
    return
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

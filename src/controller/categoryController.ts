// Half way translated

import { Request, Response } from "express"
import { db } from "../config/db"
import { ResultSetHeader, RowDataPacket } from "mysql2"
import { ICategoryDBResponse } from "../models/ICategoryDBResponse"

/**
 * ( Part of the exercise to figure search and sort functionality out on your own )
 * G ON THE ASSIGNMENT: "Hämta alla produkter tillhörande en viss kategori med GET:
 * http://localhost:3000/categories/:id/products "
 * VG ON THE ASSIGNMENT: "Utöver endpoints på G-nivå, skall även följande filtrering/sökning skapas för:
 * Hämta alla produkter med GET: http://localhost:3000/products
 * Skall kunna söka produkter efter produkt titel
 * Skall kunna sortera produktlistan efter pris, både (asc/desc) "
 */

// WORKS 5/5 16:21!
/**
 * Fetches all categories together
 * @param req 
 * @param res 
 */
export const fetchAllCategories = async (req: Request, res: Response) => {
  const search = req.query.search
  const sort = req.query.sort
  // let filteredCategories = categories

  let sql = 'SELECT * FROM categories'
  let params: any = []
  let searchSQL = ""
  let sortSQL = ""
  try {
    if (search) { 
      searchSQL
      searchSQL = " WHERE content LIKE ?"
      params = [`%${search}%`]
    } 
    
    if (sort) {
      const orderBy = sort === 'desc' ? 'DESC' : 'ASC'
      sortSQL = " ORDER BY content " + orderBy
    } 
    
    sql = sql + searchSQL + sortSQL
    // console.log(sql)
    // console.log(params)
    const [rows] = await db.query<RowDataPacket[]>(sql, params)
    res.json(rows)
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}


/**
 * Fetches a single category
 * @param req 
 * @param res 
 * @returns 
 */
export const fetchCategory = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
    // CHECK THAT THIS IS RIGHT!!!!!!! <---------------------
    // Check all the "s" at the ends.
    const sql = `
      SELECT 
        category.id AS category_id,
        category.name AS category_name,
        product.id AS product_id,
        product.title AS product_title,
        product.description AS product_description,
        product.stock AS product_stock,
        product.price AS product_price,
        product.img AS product_img,
        product.created AS product_created,
        products.category_id AS product_category_id
      FROM categories
      LEFT JOIN products ON categories.id = products.category_id
      WHERE products.id = ?
    `
    // earlier ^ it was - subtasks.created_at AS subtask_created_at

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

const formatCategory = (rows: ICategoryDBResponse[]) => ({
  id:         rows[0].category_id,
  content:    rows[0].category_name,
  products: rows.map((row) => ({
      id:        row.product_id,
      title:   row.product_title,
      description:   row.product_description,
      stock:      row.product_stock,
      price :row.product_price,
      img: row.product_img,
      created: row.product_created,
      category: row.product_category_id
  }))
})


/**
 * Creates a category
 * @param req 
 * @param res 
 * @returns 
 */
export const createTodo = async (req: Request, res: Response) => {
  const content = req.body.content;
  if (content === undefined) {
    res.status(400).json({error: 'Content is required'}) 
    return; 
  }

  try {
    const sql = `
      INSERT INTO todos (content)
      VALUES (?)
    `
    const [result] = await db.query<ResultSetHeader>(sql, [content])
    res.status(201).json({message: 'Todo created', id: result.insertId})
  } catch (error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}


/**
 * Part of the exercise to figure updateTodo out on your own
 */
/**
 * Updates a category
 * @param req 
 * @param res 
 */
export const updateTodo = (req: Request, res: Response) => {
  // const {content, done} = req.body // Destructur JS Object
  // if (content === undefined || done === undefined) {
  //   res.status(400).json({error: 'Content and Done are required'})
  //   return
  // }

  // const todo = todos.find((t) => t.id === parseInt(req.params.id))
  // if (!todo) {
  //   res.status(404).json({error: 'Todo not found'})
  //   return;
  // }
  
  // todo.content = content;
  // todo.done = done;
  // res.json({message: 'Todo updated', data: todo})
}


/**
 * Deletes a category
 * @param req 
 * @param res 
 * @returns 
 */
export const deleteTodo = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
    const sql = `
      DELETE FROM todos
      WHERE id = ?
    `
    const [result] = await db.query<ResultSetHeader>(sql, [id])
    if (result.affectedRows === 0) {
      res.status(404).json({message: 'Todo not found'})
      return;
    }
    res.json({message: 'Todo deleted'})
  } catch (error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}
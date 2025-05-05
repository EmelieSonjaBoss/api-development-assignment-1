import { Request, Response } from "express";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// WORKS 5/5 16:22!
/**
 * Part of the exercise to figure search and sort functionality out on your own
 */
export const fetchAllSubtasks = async (req: Request, res: Response) => {
  try {
    // const [rows] = await db.query<ISubtask[]>('SELECT * FROM subtasks')
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM products')
    res.json(rows)
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}


export const fetchSubtask = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
    const sql = `
      SELECT * FROM subtasks 
      WHERE id = ?
    `
    const [rows] = await db.query<RowDataPacket[]>(sql, [id])
    const subtask = rows[0];
    if (!subtask) {
      res.status(404).json({message: 'Subtask not found'})
      return;
    }
    res.json(subtask)
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}

export const createSubtask = async (req: Request, res: Response) => {
  const todo_id = req.body.todo_id;
  const content = req.body.content;
  if (content === undefined) {
    res.status(400).json({error: 'Content is required'}) 
    return; 
  }

  try {
    const sql = `
      INSERT INTO subtasks (todo_id, content)
      VALUES (?, ?)
    `
    const [result] = await db.query<ResultSetHeader>(sql, [todo_id, content])
    res.status(201).json({message: 'Subtask created', id: result.insertId})
  } catch (error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
  
}

/**
 * Part of the exercise to figure updateSubtask out on your own
 */

export const updateSubtask = (req: Request, res: Response) => {
  // const {content, done} = req.body // Destructur JS Object
  // if (content === undefined || done === undefined) {
  //   res.status(400).json({error: 'Content and Done are required'})
  //   return
  // }

  // const subtask = subtasks.find((t) => t.id === parseInt(req.params.id))
  // if (!subtask) {
  //   res.status(404).json({error: 'Subtask not found'})
  //   return;
  // }
  
  // subtask.content = content;
  // subtask.done = done;
  // res.json({message: 'Subtask updated', data: subtask})
}


export const deleteSubtask = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
    const sql = `
      DELETE FROM subtasks
      WHERE id = ?
    `
    const [result] = await db.query<ResultSetHeader>(sql, [id])
    if (result.affectedRows === 0) {
      res.status(404).json({message: 'Subtask not found'})
      return;
    }
    res.json({message: 'Subtask deleted'})
  } catch (error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}
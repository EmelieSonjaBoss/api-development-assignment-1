import express from 'express'
import { 
  createTodo, 
  deleteTodo, 
  fetchAllCategories, 
  fetchCategory, 
  updateTodo } from '../controller/categoryController'
const router = express.Router()

router.get('/', fetchAllCategories)
router.get('/:id', fetchCategory)
router.post('/', createTodo)
router.patch('/:id', updateTodo)
router.delete('/:id', deleteTodo)

export default router
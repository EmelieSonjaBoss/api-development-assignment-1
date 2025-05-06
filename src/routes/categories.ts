import express from 'express'
import { 
  createCategory, 
  deleteCategory, 
  fetchAllCategories, 
  fetchCategory, 
  updateCategory
  } from '../controller/categoryController'
const router = express.Router()

router.get('/', fetchAllCategories)
router.get('/:id', fetchCategory)
router.post('/', createCategory)
router.patch('/:id', updateCategory)
router.delete('/:id', deleteCategory)

export default router
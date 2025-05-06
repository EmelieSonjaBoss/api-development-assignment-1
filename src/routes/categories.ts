import express from 'express'
import { 
  createCategory, 
  deleteCategory, 
  fetchAllCategories, 
  fetchCategory, 
  updateCategory
  } from '../controller/categoryController'
import { fetchProductsByCategory } from '../controller/productsController'
const router = express.Router()

router.get('/', fetchAllCategories)
router.get('/:id', fetchCategory)
router.get('/:id/products', fetchProductsByCategory)
router.post('/', createCategory)
router.patch('/:id', updateCategory)
router.delete('/:id', deleteCategory)

export default router
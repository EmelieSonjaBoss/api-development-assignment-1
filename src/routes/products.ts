import express from 'express'
import { 
  createProduct, 
  deleteProduct, 
  fetchAllProducts, 
  fetchProduct, 
  updateProduct 
  } from '../controller/productsController'
const router = express.Router()

router.get('/', fetchAllProducts)
router.get('/:id', fetchProduct)

router.post('/', createProduct)
router.patch('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router
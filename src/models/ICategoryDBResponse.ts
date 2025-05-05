// TRANSLATED

import { RowDataPacket } from "mysql2"

export interface ICategoryDBResponse extends RowDataPacket{
  category_id: number
  category_name: string
  product_id: number
  product_title: string
  product_description: string
  product_stock: number
  product_price: number
  product_img: string
  product_created: string
  product_category_id: number // Is this right?! <---------------------------
}
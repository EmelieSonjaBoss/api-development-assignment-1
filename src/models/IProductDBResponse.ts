import { RowDataPacket } from "mysql2"

export interface IProductDBResponse extends RowDataPacket {
  product_id: number
  product_title: string
  product_description: string
  product_stock: number
  product_price: number
  product_img: string
  product_created: string
  category_id: number
}

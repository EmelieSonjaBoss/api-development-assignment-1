import { RowDataPacket } from "mysql2"

export interface ICategoryDBResponse extends RowDataPacket{
  category_id: number
  category_name: string
}
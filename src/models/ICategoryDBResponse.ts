/**
 * Defines the TypeScript interface for a category database row.
 */

import { RowDataPacket } from "mysql2"

export interface ICategoryDBResponse extends RowDataPacket{
  category_id: number
  category_name: string
}
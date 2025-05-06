/**
 * Validates required environment variables using Zod.
 * This ensures that all necessary configuration values exist and are correctly typed
 * before the application runs.
 *
 * Exports a strongly-typed `env` object that should be used instead of accessing `process.env` directly.
 *
 * If validation fails, the app will log a formatted error message and exit immediately.
 */

import { z } from 'zod'

// Define the schema for your expected environment variables
const envSchema = z.object({
  DB_HOST: z.string().min(1, 'DB_HOST is required'),
  DB_USER: z.string().min(1, 'DB_USER is required'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
  DB_NAME: z.string().min(1, 'DB_NAME is required'),
  DB_PORT: z
    .string()
    .regex(/^\d+$/, 'DB_PORT must be a number')
    .transform(Number), // Converts to number for direct use
})

// Validate process.env
const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Invalid environment variables:')
  console.error(_env.error.format())
  process.exit(1)
}

// Export the validated, typed environment object
export const env = _env.data

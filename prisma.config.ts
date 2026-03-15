import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  // The main entry for your schema
  schema: 'prisma/schema.prisma',
  
  // Where migrations should be generated and seed script
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  
  // The database URL
  datasource: {
    url: env('DATABASE_URL'),
  },
})

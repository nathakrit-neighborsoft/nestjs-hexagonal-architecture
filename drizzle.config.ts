import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/databases/schemas/index.ts',
  out: './src/databases/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'nestjs-hexagonal-architecture-typeorm',
  },
});

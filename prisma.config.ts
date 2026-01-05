// npm install --save-dev @prisma/config dotenv
import 'dotenv/config';
import { defineConfig } from '@prisma/config'; // @ belgisi bilan import qilinadi

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // '!' belgisi TypeScript-ga bu qiymat aniq borligini kafolatlaydi
    url: process.env.DATABASE_URL!, 
  },
});
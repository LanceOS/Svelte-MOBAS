import 'dotenv/config';
import { Config, defineConfig } from 'drizzle-kit';

const databaseUrl = `postgresql://${process.env.PRIVATE_POSTGRES_USER!}:${process.env.PRIVATE_POSTGRES_PASSWORD!}@${process.env.PRIVATE_POSTGRES_URL}/${process.env.PRIVATE_POSTGRES_DB!}`;

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/schemas/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  
}) satisfies Config;

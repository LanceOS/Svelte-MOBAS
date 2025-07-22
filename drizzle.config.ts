/**
 * @file Drizzle-Kit Configuration File
 * @description
 * This file configures Drizzle-Kit, a tool used for working with the Drizzle ORM.
 * It defines where Drizzle-Kit should find the database schema,
 * where to output generated migrations, and how to connect to the PostgreSQL database.
 *
 * It uses environment variables (loaded via 'dotenv/config') for sensitive database credentials,
 * promoting secure and flexible deployment.
 */

// Import 'dotenv/config' to load environment variables from a .env file into process.env.
// This ensures that database credentials and other configuration are not hardcoded.
import 'dotenv/config';

// Import necessary types and functions from 'drizzle-kit'.
// 'Config' is a type definition for the configuration object.
// 'defineConfig' is a helper function to ensure the configuration adheres to the 'Config' type.
import { Config, defineConfig } from 'drizzle-kit';

/**
 * @constant {string} databaseUrl
 * @description
 * Constructs the PostgreSQL connection URL using environment variables.
 * This URL follows the format: `postgresql://user:password@host:port/database_name`.
 * The `!` non-null assertion operator is used here, assuming these environment variables
 * will always be set in the deployment environment (e.g., via a .env file).
 *
 * Environment variables expected:
 * - `PRIVATE_POSTGRES_USER`: The username for the PostgreSQL database.
 * - `PRIVATE_POSTGRES_PASSWORD`: The password for the PostgreSQL database user.
 * - `PRIVATE_POSTGRES_URL`: The host and port for the PostgreSQL database (e.g., 'localhost:5432' or 'postgres:5432').
 * - `PRIVATE_POSTGRES_DB`: The name of the PostgreSQL database.
 */
const databaseUrl = `postgresql://${process.env.PRIVATE_POSTGRES_USER!}:${process.env.PRIVATE_POSTGRES_PASSWORD!}@${process.env.PRIVATE_POSTGRES_URL}/${process.env.PRIVATE_POSTGRES_DB!}`;

/**
 * @function defineConfig
 * @description
 * Exports the Drizzle-Kit configuration object.
 * This configuration guides Drizzle-Kit on how to generate and apply migrations.
 *
 * @property {string} out - Specifies the output directory for generated Drizzle migrations.
 * Migrations will be stored in the './drizzle' folder.
 * @property {string} schema - Defines the path to the Drizzle ORM schema files.
 * Drizzle-Kit will look for schema definitions in all TypeScript files
 * within the './src/lib/server/schemas/' directory.
 * @property {'postgresql'} dialect - Specifies the database dialect being used.
 * In this case, it's set to 'postgresql'.
 * @property {object} dbCredentials - An object containing the database connection details.
 * @property {string} dbCredentials.url - The full database connection URL constructed above.
 *
 * @returns {Config} The Drizzle-Kit configuration object.
 */
export default defineConfig({
  out: './drizzle', 
  schema: './src/lib/server/schemas/*.ts', 
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl, 
  },
  
}) satisfies Config; // 'satisfies Config' ensures that the configuration object conforms to the Drizzle-Kit 'Config' type.
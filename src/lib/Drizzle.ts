/**
 * @file Database Connection and Drizzle ORM Setup
 * @description
 * This file is responsible for establishing the connection to the PostgreSQL database
 * and initializing the Drizzle ORM client. It securely retrieves database credentials
 * from private environment variables, sets up a robust connection pool for efficient
 * database interactions, and loads all defined database schemas.
 *
 * It also includes a connection test to verify database accessibility on application startup.
 */

// Import private environment variables containing sensitive database credentials.
// These variables are typically loaded from a .env file and are not exposed publicly.
import { PRIVATE_POSTGRES_DB, PRIVATE_POSTGRES_PASSWORD, PRIVATE_POSTGRES_URL, PRIVATE_POSTGRES_USER } from "$env/static/private";

// Import core Drizzle ORM functionality for node-postgres.
import { drizzle } from "drizzle-orm/node-postgres";
// Import the 'Pool' class from the 'pg' library, used for managing database connections.
import { Pool } from "pg";

// Import all defined database schema files.
// These files contain the Drizzle ORM definitions for the database tables and relationships.
import * as authentication from "./server/schemas/authentication";
import * as example from "./server/schemas/example";
import * as relations from "./server/schemas/relations";

/**
 * @constant {string} databaseUrl
 * @description
 * Constructs the complete PostgreSQL connection string using the private environment variables.
 * This URL adheres to the standard format: `postgresql://user:password@host:port/database_name`.
 */
const databaseUrl = `postgresql://${PRIVATE_POSTGRES_USER}:${PRIVATE_POSTGRES_PASSWORD}@${PRIVATE_POSTGRES_URL}/${PRIVATE_POSTGRES_DB}`;

/**
 * @constant {Pool} pool
 * @description
 * Initializes a PostgreSQL connection pool. A connection pool efficiently manages
 * a set of open database connections, reusing them for multiple queries instead
 * of opening and closing a new connection for each operation. This significantly
 * improves application performance and resource utilization.
 *
 * @property {string} connectionString - The full database connection URL.
 * @property {number} max - The maximum number of simultaneous clients (connections) allowed in the pool.
 * @property {number} idleTimeoutMillis - The maximum number of milliseconds a client can remain idle in the pool before being closed.
 * @property {number} connectionTimeoutMillis - The maximum number of milliseconds to wait for a client to become available from the pool.
 */
const pool = new Pool({
    connectionString: databaseUrl,
    max: 20, // Sets the maximum number of connections to keep open.
    idleTimeoutMillis: 30000, // Closes idle connections after 30 seconds.
    connectionTimeoutMillis: 2000, // Throws an error if a connection isn't available within 2 seconds.
});

/**
 * @function testConnection
 * @description
 * Asynchronously tests the database connection by attempting to acquire and immediately
 * release a client from the connection pool. Logs a success message if the connection
 * is established or an error message if the connection fails. This function is
 * executed once when the file is loaded to provide immediate feedback on database connectivity.
 */
async function testConnection() {
    try {
        const client = await pool.connect(); // Attempt to get a client from the pool.
        console.log("Database connection test successful");
        client.release(); // Release the client back to the pool.
    }
    catch(error) {
        console.error("Failed to connect to the database:", error);
    }
}

// Execute the connection test when this module is imported.
testConnection();

/**
 * @constant {object} schemas
 * @description
 * An aggregated object containing all Drizzle ORM schema definitions imported from
 * various schema files. This combined schema object is passed to the Drizzle client
 * so it understands the full structure of the database.
 * 
 * @note If the amount of schema's in for your database becomes large you can move your
 * schemas to a "barrel" file. Learn more about barrels here at https://basarat.gitbook.io/typescript/main-1/barrel.
 */
const schemas = {
    ...authentication, // Includes all table and relation schemas from 'authentication.ts'.
    ...example,         // Includes all table and relation schemas from 'example.ts'.
    ...relations        // Includes all table and relation schemas from 'relations.ts'.
};

/**
 * @constant {ReturnType<typeof drizzle>} DrizzleDB
 * @description
 * The main Drizzle ORM database client instance. This is the primary export
 * from this file and should be used throughout the application to perform
 * all database operations (e.g., querying, inserting, updating, deleting data).
 * It's configured with the connection pool and the combined database schemas.
 */
export const DrizzleDB = drizzle(pool, { schema: schemas });
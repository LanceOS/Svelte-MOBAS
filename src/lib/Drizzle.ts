import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = `postgresql://${PRIVATE_POSTGRES_USER}:${PRIVATE_POSTGRES_PASSWORD}@${PRIVATE_POSTGRES_URL}/${PRIVATE_POSTGRES_DB}`;


const pool = new Pool({
    connectionString: databaseUrl,

    max: 20, // maximum number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // how long to wait to acquire a client before timing out
});

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log("Database connection test successful");
        client.release()
    }
    catch(error) {
        console.error(error)
    }
}

testConnection()

const schemas = {

}


export const DrizzleDB = drizzle(pool, { schema: schemas }) 
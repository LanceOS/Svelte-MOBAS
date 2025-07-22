/**
 * @file Authentication Configuration (better-auth)
 * @description
 * This file configures the 'better-auth' library, which is the application's
 * complete solution for handling user authentication (signup, login, sessions, etc.).
 * It integrates seamlessly with the Drizzle ORM database to manage user data.
 *
 * @note For a comprehensive list of all configuration options, please refer to the
 * [better-auth official documentation](https://www.better-auth.com/docs/basic-usage).
 */

// Import the main 'betterAuth' function.
import { betterAuth } from "better-auth";
// Import the Drizzle adapter to connect 'better-auth' with the Drizzle ORM setup.
import { drizzleAdapter } from "better-auth/adapters/drizzle";
// Importing initialized Drizzle ORM database client.
import { DrizzleDB } from "./Drizzle.js";
// Importing application's public URL, used for security configurations like trusted origins.
import { PUBLIC_URL } from "$env/static/public";

// Importing authentication-related database schemas. These define the tables
// that 'better-auth' will use for users, sessions, etc.
import * as authentication from "./server/schemas/authentication.js"

/**
 * @constant {ReturnType<typeof betterAuth>} auth
 * @description
 * The primary 'better-auth' instance, configured to manage user authentication.
 * Use this object throughout the application to access authentication functionalities.
 *
 * @property {object} database - Configures how 'better-auth' interacts with the database.
 * @property {function} database.drizzleAdapter - Integrates Drizzle ORM.
 * @property {object} session - Defines how user sessions behave (e.g., expiry, refresh).
 * @property {number} session.expiresIn - Session duration (e.g., 7 days here).
 * @property {number} session.updateAge - How often an active session's expiry is refreshed.
 * @property {object} user - Settings related to user accounts.
 * @property {object} user.additionalFields - Allows adding custom fields to the user schema (e.g., 'role').
 * @property {object} emailAndPassword - Controls standard email/password authentication features.
 * @property {boolean} emailAndPassword.enabled - Whether email/password login is active.
 * @property {boolean} emailAndPassword.autoSignIn - Automatically sign in after registration.
 * @property {object} socialProviders - Placeholder for enabling and configuring third-party social logins.
 * @property {object} databaseHooks - Custom functions to run before or after database operations.
 * @property {object} rateLimit - Configures API rate limiting to prevent abuse.
 * @property {string} basePath - The base URL path for all authentication API endpoints.
 * @property {string[]} trustedOrigins - A list of URLs allowed to make authentication requests for security.
 */
export const auth = betterAuth({
    database: drizzleAdapter(DrizzleDB, {
        provider: "pg", // Specifies PostgreSQL as the database provider.
        schema: authentication // Links to the Drizzle schemas for authentication.
    }),
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24 // Updates after 24 hours of activity
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user" // Default role for new users.
            }
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
    },
    socialProviders: {
        // Add configurations for Google, GitHub, etc., here if needed.
    },
    databaseHooks: {
        // Implement custom logic here, e.g., onUserCreated, onSignIn.
    },
    rateLimit: {
        window: 10, // 10-second window
        max: 100, // Max 100 requests
    },
    basePath: "/api/auth", // All auth routes will be under /api/auth.
    trustedOrigins: [`${PUBLIC_URL}`] // Ensures requests come from the application's URL.
});
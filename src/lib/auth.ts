import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { DrizzleDB } from "./Drizzle.js";
import { PUBLIC_URL } from "$env/static/public";


export const auth = betterAuth({
    database: drizzleAdapter(DrizzleDB, {
        provider: "pg",
        schema: schema
    }),
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24 // Updates after 24 hours of activity
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user"
            }
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
    },
    // If you prefer to use social providers add them here.
    socialProviders: {

    },
    databaseHooks: {

    },
    rateLimit: {
        window: 10, // 10-second window
        max: 100, // Max 100 requests
    },
    basePath: "/api/auth",
    trustedOrigins: [`${PUBLIC_URL}`]
});
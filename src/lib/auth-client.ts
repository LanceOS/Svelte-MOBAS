/**
 * @file Client-Side Authentication Setup (better-auth Svelte Client)
 * @description
 * This file sets up the client-side authentication for the Svelte application using `better-auth`.
 * It configures the connection to the backend authentication API and provides core functions
 * and types for managing user authentication and sessions in the frontend.
 *
 * @note For detailed API usage and configuration options, please refer to the
 * [better-auth Svelte Client documentation](https://www.better-auth.com/docs/integrations/svelte-kit).
 */

// Core imports for the better-auth Svelte client and necessary plugins.
import { emailOTPClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/svelte";

// Type import for backend configuration and public URL.
import type { auth } from './auth.ts';
import { PUBLIC_URL } from "$env/static/public";

/**
 * @constant {ReturnType<typeof createAuthClient>} authClient
 * @description
 * The main client-side authentication instance. Configured to connect to the
 * backend authentication API at `${PUBLIC_URL}/api/auth` and includes essential
 * plugins like `inferAdditionalFields` (for custom user data typing) and `emailOTPClient`
 * (for OTP-based authentication flows).
 */
export const authClient = createAuthClient({
    baseURL: `${PUBLIC_URL}/api/auth`,
    plugins: [inferAdditionalFields<typeof auth>(), emailOTPClient()],
});

/**
 * @constant {object} Authentication Utilities
 * @description
 * Destructured export of key authentication functions from `createAuthClient` for
 * direct use in the Svelte components.
 *
 * @property {function} signIn - Initiates the user login process.
 * @property {function} signUp - Handles new user registration.
 * @property {function} useSession - A reactive Svelte store to access the current user session.
 * @property {function} getSession - Imperatively retrieves the current user session.
 */
export const { signIn, signUp, useSession, getSession } = createAuthClient();

/**
 * @typedef {typeof authClient.$Infer.Session} Session
 * @description
 * TypeScript type definition for the authenticated user session object,
 * ensuring strong typing for session data across the frontend.
 */
export type Session = typeof authClient.$Infer.Session;
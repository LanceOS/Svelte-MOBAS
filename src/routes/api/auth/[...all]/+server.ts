import { svelteKitHandler } from 'better-auth/svelte-kit';
import { auth } from '$lib/auth';

// This file handles ALL HTTP methods (GET, POST, PUT, DELETE, etc.)
// that Better Auth might need. The [...all] syntax catches any sub-path.

export async function GET(event, resolve) {
    // The svelteKitHandler processes the request and returns the appropriate response
    // based on the Better Auth configuration.
    return svelteKitHandler({ event, resolve, auth });
}

export async function POST(event, resolve) {
    return svelteKitHandler({ event, resolve, auth });
}

export async function PUT(event, resolve) {
    return svelteKitHandler({ event, resolve, auth });
}

export async function DELETE(event, resolve) {
    return svelteKitHandler({ event, resolve, auth });
}

export async function PATCH(event, resolve) {
    return svelteKitHandler({ event, resolve, auth });
}

export async function HEAD(event, resolve) {
    return svelteKitHandler({ event, resolve, auth });
}

export async function OPTIONS(event, resolve) {
    return svelteKitHandler({ event, resolve, auth });
}
import { cookies } from 'next/headers';

export async function getCookie(name: string): Promise<string | null> {
    const cookieStore = await cookies(); // ✅ ADD `await` here
    return cookieStore.get(name)?.value ?? null;
}

export async function setCookie(
    name: string,
    value: string,
    options: { httpOnly?: boolean, maxAge?: number; path?: string, secure?: boolean, sameSite?: "lax" | "strict" | "none" | boolean } = {}
): Promise<void> {
    const cookieStore = await cookies(); // This correctly awaits the cookies() function
    cookieStore.set({ name, value, ...options });
}

export async function deleteCookie(name: string): Promise<void> { // ✅ Make the function async
    const cookieStore = await cookies(); // ✅ ADD `await` here
    cookieStore.delete(name);
}
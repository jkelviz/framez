/** SHA-256 hex for gallery password storage (verify with same hash on gate). */
export async function sha256Hex(plain: string): Promise<string> {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(plain))
    return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
}

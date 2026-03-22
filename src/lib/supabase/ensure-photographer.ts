import type { User } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

function baseSlugFromUser(user: User) {
    const raw =
        (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
        user.email?.split("@")[0] ||
        "user"
    const slugPart = raw
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    return slugPart || "user"
}

/**
 * Ensures a photographers row exists for the current session user (backfill for accounts created before the DB trigger).
 */
export async function ensurePhotographerProfile(supabase: SupabaseClient<Database>): Promise<void> {
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data: existing } = await supabase.from("photographers").select("id").eq("user_id", user.id).maybeSingle()
    if (existing) return

    const name =
        (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
        user.email?.split("@")[0] ||
        "User"

    const base = baseSlugFromUser(user)
    for (let i = 0; i < 8; i++) {
        const slug = i === 0 ? `${base}-${user.id.slice(0, 8)}` : `${base}-${user.id.slice(0, 6)}-${i}`
        const { error } = await supabase.from("photographers").insert({
            user_id: user.id,
            name,
            slug,
            plan: "free",
        })
        if (!error) return
        if (error.code !== "23505") {
            console.warn("ensurePhotographerProfile:", error.message)
            return
        }
    }
}

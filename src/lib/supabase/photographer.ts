import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

export type PhotographerSummary = {
    id: string
    name: string | null
}

export async function getPhotographer(supabase: SupabaseClient<Database>): Promise<PhotographerSummary | null> {
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
        .from("photographers")
        .select("id, name")
        .eq("user_id", user.id)
        .single()

    if (error || !data) return null
    return { id: data.id, name: data.name }
}

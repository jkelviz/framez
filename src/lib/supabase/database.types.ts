export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            photographers: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    bio: string | null
                    slug: string
                    avatar_url: string | null
                    plan: string | null
                    created_at: string | null
                    stripe_customer_id: string | null
                    stripe_subscription_id: string | null
                    stripe_price_id: string | null
                    stripe_current_period_end: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    bio?: string | null
                    slug: string
                    avatar_url?: string | null
                    plan?: string | null
                    created_at?: string | null
                    stripe_customer_id?: string | null
                    stripe_subscription_id?: string | null
                    stripe_price_id?: string | null
                    stripe_current_period_end?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    bio?: string | null
                    slug?: string
                    avatar_url?: string | null
                    plan?: string | null
                    created_at?: string | null
                    stripe_customer_id?: string | null
                    stripe_subscription_id?: string | null
                    stripe_price_id?: string | null
                    stripe_current_period_end?: string | null
                }
            }
            sessions: {
                Row: {
                    id: string
                    photographer_id: string
                    title: string
                    client_name: string
                    slug: string
                    style: string | null
                    password_hash: string | null
                    expires_at: string | null
                    status: string
                    cover_photo_url: string | null
                    created_at: string
                    view_count: number | null
                }
                Insert: {
                    id?: string
                    photographer_id: string
                    title: string
                    client_name: string
                    slug: string
                    style?: string | null
                    password_hash?: string | null
                    expires_at?: string | null
                    status?: string
                    cover_photo_url?: string | null
                    created_at?: string
                    view_count?: number | null
                }
                Update: {
                    id?: string
                    photographer_id?: string
                    title?: string
                    client_name?: string
                    slug?: string
                    style?: string | null
                    password_hash?: string | null
                    expires_at?: string | null
                    status?: string
                    cover_photo_url?: string | null
                    created_at?: string
                    view_count?: number | null
                }
            }
            photos: {
                Row: {
                    id: string
                    session_id: string
                    url: string
                    thumbnail_url: string | null
                    width: number | null
                    height: number | null
                    order_index: number | null
                    is_favorite: boolean
                    is_selected: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    session_id: string
                    url: string
                    thumbnail_url?: string | null
                    width?: number | null
                    height?: number | null
                    order_index?: number | null
                    is_favorite?: boolean
                    is_selected?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    session_id?: string
                    url?: string
                    thumbnail_url?: string | null
                    width?: number | null
                    height?: number | null
                    order_index?: number | null
                    is_favorite?: boolean
                    is_selected?: boolean
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

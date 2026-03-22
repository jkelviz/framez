"use client";

import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Star, CheckCircle, GripVertical, Trash2, Image as ImageIcon, X, Plus, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Photo {
    id: string;
    url: string;
    is_favorite: boolean;
    is_selected: boolean;
}

const SortablePhoto = ({ photo, onRemove, onSetCover, onSetFavorite }: { photo: Photo, onRemove: (id: string, url: string) => void, onSetCover: (url: string) => void, onSetFavorite: (id: string) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: photo.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative aspect-square overflow-hidden rounded-lg bg-[#161616] border border-[rgba(255,255,255,0.08)]",
                photo.is_favorite && "ring-[1.5px] ring-[#E85D24]"
            )}
        >
            <img src={photo.url} alt="Photo" className="absolute inset-0 w-full h-full object-cover" />

            {/* CAPA badge - bottom left for cover photo */}
            {photo.is_favorite && (
                <span className="absolute bottom-2 left-2 z-10 rounded-full bg-[#E85D24] px-2 py-0.5 text-[10px] font-semibold uppercase text-white shadow-md">
                    CAPA
                </span>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-between w-full">
                    {!photo.is_favorite && (
                        <div
                            {...attributes}
                            {...listeners}
                            className="flex h-6 w-6 cursor-grab items-center justify-center rounded bg-[rgba(0,0,0,0.6)] transition-opacity"
                        >
                            <GripVertical className="h-3.5 w-3.5 text-white" />
                        </div>
                    )}
                    <button onClick={(e) => { e.preventDefault(); onRemove(photo.id, photo.url); }} className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded bg-[rgba(0,0,0,0.6)] hover:bg-red-500 transition-colors" title="Remover">
                        <X className="h-3.5 w-3.5 text-white" />
                    </button>
                </div>
                {!photo.is_favorite && (
                    <button onClick={(e) => { e.preventDefault(); onSetCover(photo.url); onSetFavorite(photo.id); }} className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[rgba(0,0,0,0.75)] px-2.5 py-1 text-[11px] font-medium text-white transition-all hover:bg-[rgba(0,0,0,0.9)] whitespace-nowrap">
                        Definir como capa
                    </button>
                )}
            </div>
        </div>
    );
};

export function PhotoGridManager({ sessionId }: { sessionId?: string }) {
    const supabase = createClient();
    const [photos, setPhotos] = useState<Photo[]>([]);

    useEffect(() => {
        if (!sessionId) return;

        const fetchPhotos = async () => {
            const { data } = await supabase.from('photos').select('*').eq('session_id', sessionId).order('created_at', { ascending: true });
            if (data) setPhotos(data);
        };
        fetchPhotos();

        const channel = supabase.channel(`schema-db-changes-${sessionId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'photos', filter: `session_id=eq.${sessionId}` }, (payload) => {
                setPhotos(prev => [...prev, payload.new as Photo]);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [sessionId, supabase]);

    const handleRemove = async (id: string, url: string) => {
        const { error } = await supabase.from('photos').delete().eq('id', id);
        if (!error) {
            setPhotos(prev => prev.filter(p => p.id !== id));
            toast.success("Foto removida.");
            const path = url.split('/session_photos/')[1];
            if (path) supabase.storage.from('session_photos').remove([path]);
        }
    };

    const handleSetCover = async (url: string) => {
        if (!sessionId) return;
        const { error } = await supabase.from('sessions').update({ cover_photo_url: url }).eq('id', sessionId);
        if (!error) toast.success("Capa do ensaio atualizada!");
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setPhotos((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleSetFavoriteNode = async (id: string) => {
        if (!sessionId) return
        setPhotos((prev) => prev.map((p) => ({ ...p, is_favorite: p.id === id })))
        await supabase.from("photos").update({ is_favorite: false }).eq("session_id", sessionId)
        await supabase.from("photos").update({ is_favorite: true }).eq("id", id)
    }

    if (!photos.length) return null;

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-semibold text-[#F5F5F0]">
                    Fotos ({photos.length})
                </span>
            </div>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={photos} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-3 gap-2">
                        {photos.map((photo) => (
                            <SortablePhoto key={photo.id} photo={photo} onRemove={handleRemove} onSetCover={handleSetCover} onSetFavorite={handleSetFavoriteNode} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {photos.filter(p => p.is_favorite).length === 0 && (
                <p className="mt-3 text-center text-[12px] italic text-[#888880]">
                    Passe o mouse sobre uma foto para definir a capa
                </p>
            )}
            <p className="mt-3 text-center text-[12px] text-[#888880]">
                Arraste as fotos para reordenar
            </p>
            <p className="mt-3 text-right text-[13px] text-[#888880]">
                {photos.length} fotos adicionadas
            </p>
        </div>
    );
}

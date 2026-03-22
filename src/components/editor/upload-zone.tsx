"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileImage, Loader2, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function UploadZone({ sessionId }: { sessionId?: string }) {
    const supabase = createClient();
    const [uploadingFiles, setUploadingFiles] = useState<{ name: string, status: 'pending' | 'uploading' | 'done' | 'error' }[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (!sessionId) return;

        setIsUploading(true);
        const mappedFiles = acceptedFiles.map(f => ({ name: f.name, status: 'pending' as const }));
        setUploadingFiles(prev => [...prev, ...mappedFiles]);

        let successCount = 0;

        for (let i = 0; i < acceptedFiles.length; i++) {
            const file = acceptedFiles[i];

            // update state
            setUploadingFiles(prev => prev.map(f => f.name === file.name ? { ...f, status: 'uploading' } : f));

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `${sessionId}/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('session_photos').upload(filePath, file);

            if (uploadError) {
                setUploadingFiles(prev => prev.map(f => f.name === file.name ? { ...f, status: 'error' } : f));
                console.error("Upload error", uploadError);
            } else {
                const { data } = supabase.storage.from('session_photos').getPublicUrl(filePath);

                await supabase.from('photos').insert({
                    session_id: sessionId,
                    url: data.publicUrl,
                    is_favorite: false,
                    is_selected: false
                });

                successCount++;
                setUploadingFiles(prev => prev.map(f => f.name === file.name ? { ...f, status: 'done' } : f));
            }
        }

        setIsUploading(false);
        if (successCount > 0) {
            toast.success(`${successCount} fotos enviadas com sucesso!`);
            // In a complete implementation we would trigger a refresh of the Grid below via state or router.refresh() 
            setTimeout(() => setUploadingFiles([]), 3000);
        }
    }, [sessionId, supabase]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    });

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={cn(
                    "flex min-h-[300px] flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all cursor-pointer",
                    isDragActive
                        ? "border-[#E85D24] bg-[rgba(232,93,36,0.04)]"
                        : "border-[rgba(232,93,36,0.25)] hover:border-[rgba(232,93,36,0.4)]"
                )}
            >
                <input {...getInputProps()} />
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(232,93,36,0.1)] mb-4">
                    <Camera className="h-6 w-6 text-[#E85D24]" />
                </div>
                <p className="text-[20px] font-medium text-[#F5F5F0]">
                    Arraste suas fotos aqui
                </p>
                <p className="mt-1 text-[14px] text-[#888880]">
                    ou clique para selecionar
                </p>
                <p className="mt-3 text-[12px] text-[#555]">
                    JPG, PNG, WEBP · máx 20MB por foto
                </p>
            </div>

            {uploadingFiles.length > 0 && (
                <div className="space-y-4 pt-4 animate-in fade-in">
                    <p className="font-medium text-sm text-fz-text-secondary flex items-center gap-2">
                        {isUploading && <Loader2 className="w-4 h-4 animate-spin text-fz-accent" />}
                        Transferindo {uploadingFiles.length} arquivos...
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {uploadingFiles.map((file, i) => (
                            <div key={i} className="aspect-square bg-fz-bg-elevated rounded-md border border-fz-border flex flex-col items-center justify-center p-2 text-center transition-all">
                                <FileImage className={`h-8 w-8 mb-2 ${file.status === 'done' ? 'text-green-500' : file.status === 'error' ? 'text-red-500' : 'text-fz-accent animate-pulse'}`} />
                                <span className="text-xs text-fz-text-secondary truncate w-full px-1">{file.name}</span>
                                {file.status === 'uploading' && (
                                    <div className="w-full bg-fz-bg-base h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div className="bg-fz-accent h-full w-[45%] animate-[marquee_1s_linear_infinite]" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

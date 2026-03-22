"use client";

interface Photo {
    id: string;
    src: string;
}

interface StoryLayoutProps {
    photos: Photo[];
    onPhotoClick: (index: number) => void;
}

export function StoryLayout({ photos, onPhotoClick }: StoryLayoutProps) {
    return (
        <div className="w-full bg-black flex flex-col items-center">
            {photos.map((photo, index) => (
                <div
                    key={photo.id}
                    className="w-full min-h-[80vh] py-12 flex items-center justify-center cursor-pointer border-b border-fz-border/30 last:border-0"
                    onClick={() => onPhotoClick(index)}
                >
                    <img
                        src={photo.src}
                        alt={`Foto ${index + 1}`}
                        className="w-full max-w-5xl h-auto object-contain px-4 md:px-8"
                    />
                </div>
            ))}
        </div>
    );
}

"use client";

import PhotoAlbum from "react-photo-album";

interface Photo {
    id: string;
    src: string;
    width: number;
    height: number;
}

interface GridLayoutProps {
    photos: Photo[];
    onPhotoClick: (index: number) => void;
}

export function GridLayout({ photos, onPhotoClick }: GridLayoutProps) {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <PhotoAlbum
                layout="masonry"
                photos={photos}
                onClick={({ index }) => onPhotoClick(index)}
                spacing={16}
                columns={(containerWidth) => {
                    if (containerWidth < 640) return 2;
                    if (containerWidth < 1024) return 3;
                    return 4;
                }}
            />
        </div>
    );
}

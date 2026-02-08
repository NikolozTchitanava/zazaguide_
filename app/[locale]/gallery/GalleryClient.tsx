'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from '@/components/Lightbox';
import styles from './page.module.css';

interface GalleryImage {
    id: string;
    url: string;
    caption: string | null;
}

export default function GalleryClient({ images }: { images: GalleryImage[] }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    return (
        <>
            <div className={styles.gallery}>
                {images.map((image, index) => (
                    <div
                        key={image.id}
                        className={styles.galleryItem}
                        onClick={() => openLightbox(index)}
                    >
                        {image.url.startsWith('data:') ? (
                            <img
                                src={image.url}
                                alt={image.caption || `Gallery image ${index + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <Image
                                src={image.url}
                                alt={image.caption || `Gallery image ${index + 1}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        )}
                    </div>
                ))}
            </div>

            {lightboxOpen && (
                <Lightbox
                    images={images}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxOpen(false)}
                />
            )}
        </>
    );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './Lightbox.module.css';

interface LightboxProps {
    images: { id: string; url: string; caption?: string | null }[];
    initialIndex: number;
    onClose: () => void;
}

export default function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
    };

    return (
        <div className={styles.lightbox} onClick={onClose} onKeyDown={handleKeyDown} tabIndex={0}>
            <button className={styles.close} onClick={onClose} aria-label="Close">
                ×
            </button>

            <button className={styles.prev} onClick={(e) => { e.stopPropagation(); goToPrevious(); }} aria-label="Previous">
                ‹
            </button>

            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <div className={styles.imageWrapper}>
                    {images[currentIndex].url.startsWith('data:') ? (
                        <img
                            src={images[currentIndex].url}
                            alt={images[currentIndex].caption || `Image ${currentIndex + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                    ) : (
                        <Image
                            src={images[currentIndex].url}
                            alt={images[currentIndex].caption || `Image ${currentIndex + 1}`}
                            fill
                            style={{ objectFit: 'contain' }}
                            sizes="100vw"
                        />
                    )}
                </div>
                {images[currentIndex].caption && (
                    <p className={styles.caption}>{images[currentIndex].caption}</p>
                )}
                <p className={styles.counter}>
                    {currentIndex + 1} / {images.length}
                </p>
            </div>

            <button className={styles.next} onClick={(e) => { e.stopPropagation(); goToNext(); }} aria-label="Next">
                ›
            </button>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

interface GalleryImage {
    id: string;
    url: string;
    caption: string | null;
}

const locales: Array<'en' | 'ka' | 'ru'> = ['en', 'ka', 'ru'];

export default function AdminGalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [activeLocale, setActiveLocale] = useState<'en' | 'ka' | 'ru'>('en');
    const [captions, setCaptions] = useState<Record<'en' | 'ka' | 'ru', string>>({
        en: '',
        ka: '',
        ru: '',
    });

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await fetch('/api/gallery?locale=en&limit=60');
            const data = await res.json();
            setImages(data.items || []);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            if (!uploadRes.ok) {
                alert('Failed to upload image');
                return;
            }
            const uploadData = await uploadRes.json();

            const translations = locales
                .map((locale) => ({ locale, caption: captions[locale] }))
                .filter((entry) => entry.caption && entry.caption.trim().length > 0);

            const galleryRes = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: uploadData.url, translations }),
            });

            if (galleryRes.ok) {
                setCaptions({ en: '', ka: '', ru: '' });
                fetchImages();
            } else {
                alert('Failed to add image to gallery');
            }
        } catch (error) {
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchImages();
            } else {
                alert('Failed to delete image');
            }
        } catch (error) {
            alert('Error deleting image');
        }
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.page}>
            <h1>Gallery Management</h1>
            <p className={styles.subtitle}>Upload and manage gallery images</p>

            <div className={styles.uploadSection}>
                <h2>Upload New Image</h2>
                <div className={styles.localeToggle}>
                    {locales.map((locale) => (
                        <button
                            type="button"
                            key={locale}
                            className={activeLocale === locale ? styles.localeActive : styles.localeButton}
                            onClick={() => setActiveLocale(locale)}
                        >
                            {locale.toUpperCase()}
                        </button>
                    ))}
                </div>
                <div className={styles.uploadForm}>
                    <input
                        type="text"
                        placeholder={`Caption (${activeLocale.toUpperCase()})`}
                        value={captions[activeLocale]}
                        onChange={(e) => setCaptions({ ...captions, [activeLocale]: e.target.value })}
                        className={styles.captionInput}
                    />
                    <label className={styles.uploadBtn}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                            style={{ display: 'none' }}
                        />
                        {uploading ? 'Uploading...' : '+ Upload Image'}
                    </label>
                </div>
            </div>

            <div className={styles.gallery}>
                {images.length === 0 ? (
                    <p className={styles.empty}>No images in gallery yet. Upload your first image!</p>
                ) : (
                    images.map((image) => (
                        <div key={image.id} className={styles.imageCard}>
                            <div className={styles.imageWrapper}>
                                <Image src={image.url} alt={image.caption || 'Gallery image'} fill style={{ objectFit: 'cover' }} />
                            </div>
                            {image.caption && <p className={styles.imageCaption}>{image.caption}</p>}
                            <button onClick={() => handleDelete(image.id)} className={styles.deleteBtn}>
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

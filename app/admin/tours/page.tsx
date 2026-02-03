'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface TourTranslation {
    locale: 'en' | 'ka' | 'ru';
    name: string;
    description: string;
}

interface Tour {
    id: string;
    price: string | number;
    difficulty: string;
    featured: boolean;
    images: { id: string; url: string; isPrimary: boolean }[];
    times: { id: string; timeSlot: string }[];
    translations: TourTranslation[];
}

const locales: Array<'en' | 'ka' | 'ru'> = ['en', 'ka', 'ru'];

export default function AdminToursPage() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTour, setEditingTour] = useState<Tour | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [activeLocale, setActiveLocale] = useState<'en' | 'ka' | 'ru'>('en');

    const [price, setPrice] = useState('');
    const [difficulty, setDifficulty] = useState('Easy');
    const [featured, setFeatured] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>(['']);
    const [timeSlots, setTimeSlots] = useState<string[]>(['']);
    const [uploading, setUploading] = useState(false);
    const [translations, setTranslations] = useState<Record<'en' | 'ka' | 'ru', { name: string; description: string }>>({
        en: { name: '', description: '' },
        ka: { name: '', description: '' },
        ru: { name: '', description: '' },
    });

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            const res = await fetch('/api/tours?includeTranslations=true');
            const data = await res.json();
            setTours(data);
        } catch (error) {
            console.error('Error fetching tours:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) {
                alert('Failed to upload image');
                return;
            }
            const data = await res.json();
            const newUrls = [...imageUrls];
            newUrls[index] = data.url;
            setImageUrls(newUrls);
        } catch (error) {
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!translations.en.name.trim() || !translations.en.description.trim()) {
            alert('English name and description are required.');
            return;
        }

        const payload = {
            price,
            difficulty,
            featured,
            images: imageUrls.filter(url => url).map(url => ({ url })),
            times: timeSlots.filter(t => t),
            translations: locales.map((locale) => ({
                locale,
                name: translations[locale].name,
                description: translations[locale].description,
            })),
        };

        try {
            const url = editingTour ? `/api/tours/${editingTour.id}` : '/api/tours';
            const method = editingTour ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                resetForm();
                fetchTours();
            } else {
                alert('Failed to save tour');
            }
        } catch (error) {
            alert('Error saving tour');
        }
    };

    const handleEdit = (tour: Tour) => {
        setEditingTour(tour);
        setPrice(tour.price.toString());
        setDifficulty(tour.difficulty);
        setFeatured(tour.featured);
        setImageUrls(tour.images.map(img => img.url).concat(['']));
        setTimeSlots(tour.times.map(t => t.timeSlot).concat(['']));

        const nextTranslations: Record<'en' | 'ka' | 'ru', { name: string; description: string }> = {
            en: { name: '', description: '' },
            ka: { name: '', description: '' },
            ru: { name: '', description: '' },
        };
        tour.translations.forEach((translation) => {
            nextTranslations[translation.locale] = {
                name: translation.name,
                description: translation.description,
            };
        });
        setTranslations(nextTranslations);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this tour?')) return;

        try {
            const res = await fetch(`/api/tours/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchTours();
            } else {
                alert('Failed to delete tour');
            }
        } catch (error) {
            alert('Error deleting tour');
        }
    };

    const resetForm = () => {
        setEditingTour(null);
        setPrice('');
        setDifficulty('Easy');
        setFeatured(false);
        setImageUrls(['']);
        setTimeSlots(['']);
        setActiveLocale('en');
        setTranslations({
            en: { name: '', description: '' },
            ka: { name: '', description: '' },
            ru: { name: '', description: '' },
        });
        setShowForm(false);
    };

    const updateTranslation = (locale: 'en' | 'ka' | 'ru', field: 'name' | 'description', value: string) => {
        setTranslations((prev) => ({
            ...prev,
            [locale]: {
                ...prev[locale],
                [field]: value,
            },
        }));
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>Manage Tours</h1>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    {showForm ? 'Cancel' : '+ New Tour'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h2>{editingTour ? 'Edit Tour' : 'Create New Tour'}</h2>

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

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Tour Name ({activeLocale.toUpperCase()}) *</label>
                            <input
                                value={translations[activeLocale].name}
                                onChange={(e) => updateTranslation(activeLocale, 'name', e.target.value)}
                                required={activeLocale === 'en'}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Price (GEL) *</label>
                            <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
                        </div>

                        <div className={styles.field}>
                            <label>Difficulty *</label>
                            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Description ({activeLocale.toUpperCase()}) *</label>
                        <textarea
                            value={translations[activeLocale].description}
                            onChange={(e) => updateTranslation(activeLocale, 'description', e.target.value)}
                            rows={6}
                            required={activeLocale === 'en'}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>
                            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                            {' '}Featured on Homepage
                        </label>
                    </div>

                    <div className={styles.field}>
                        <label>Tour Images</label>
                        {imageUrls.map((url, index) => (
                            <div key={index} className={styles.imageField}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, index)}
                                    disabled={uploading}
                                />
                                {url && <span className={styles.imagePreview}>Uploaded</span>}
                                {index === imageUrls.length - 1 && (
                                    <button type="button" onClick={() => setImageUrls([...imageUrls, ''])} className={styles.addBtn}>
                                        + Add Image
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className={styles.field}>
                        <label>Available Times</label>
                        {timeSlots.map((slot, index) => (
                            <div key={index} className={styles.timeField}>
                                <input
                                    value={slot}
                                    onChange={(e) => {
                                        const newSlots = [...timeSlots];
                                        newSlots[index] = e.target.value;
                                        setTimeSlots(newSlots);
                                    }}
                                    placeholder="e.g., 9:00 AM - 12:00 PM"
                                />
                                {index === timeSlots.length - 1 && (
                                    <button type="button" onClick={() => setTimeSlots([...timeSlots, ''])} className={styles.addBtn}>
                                        + Add Time
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className={styles.formActions}>
                        <button type="submit" className="btn btn-primary" disabled={uploading}>
                            {editingTour ? 'Update Tour' : 'Create Tour'}
                        </button>
                        <button type="button" onClick={resetForm} className="btn btn-outline">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className={styles.toursList}>
                {tours.length === 0 ? (
                    <p className={styles.empty}>No tours yet. Create your first tour!</p>
                ) : (
                    tours.map((tour) => {
                        const english = tour.translations.find((t) => t.locale === 'en');
                        return (
                            <div key={tour.id} className={styles.tourCard}>
                                <div className={styles.tourHeader}>
                                    <h3>{english?.name || 'Untitled tour'}</h3>
                                    {tour.featured && <span className={styles.featuredBadge}>Featured</span>}
                                </div>
                                <p className={styles.tourMeta}>
                                    {tour.price} GEL • {tour.difficulty} • {tour.images.length} images • {tour.times.length} time slots
                                </p>
                                <div className={styles.tourActions}>
                                    <button onClick={() => handleEdit(tour)} className="btn btn-secondary">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(tour.id)} className="btn btn-outline">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

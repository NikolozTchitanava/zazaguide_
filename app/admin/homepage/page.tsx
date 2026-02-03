'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function AdminHomepagePage() {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [locale, setLocale] = useState<'en' | 'ka' | 'ru'>('en');

    useEffect(() => {
        fetchSettings(locale);
    }, [locale]);

    const fetchSettings = async (targetLocale: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/settings?locale=${targetLocale}`);
            const data = await res.json();
            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/settings?locale=${locale}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                alert('Settings saved successfully!');
            } else {
                alert('Failed to save settings');
            }
        } catch (error) {
            alert('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (key: string, value: string) => {
        setSettings({ ...settings, [key]: value });
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.page}>
            <h1>Homepage Settings</h1>
            <p className={styles.subtitle}>Edit the content displayed on the homepage</p>
            <div className={styles.localeToggle}>
                {['en', 'ka', 'ru'].map((lang) => (
                    <button
                        key={lang}
                        type="button"
                        className={locale === lang ? styles.localeActive : styles.localeButton}
                        onClick={() => setLocale(lang as 'en' | 'ka' | 'ru')}
                    >
                        {lang.toUpperCase()}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <section className={styles.section}>
                    <h2>Hero Section</h2>
                    <div className={styles.field}>
                        <label>Hero Eyebrow</label>
                        <input
                            value={settings.heroEyebrow || ''}
                            onChange={(e) => updateSetting('heroEyebrow', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Hero Tagline</label>
                        <input
                            value={settings.heroTagline || ''}
                            onChange={(e) => updateSetting('heroTagline', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Hero Subtitle</label>
                        <input
                            value={settings.heroSubtitle || ''}
                            onChange={(e) => updateSetting('heroSubtitle', e.target.value)}
                        />
                    </div>
                </section>

                <section className={styles.section}>
                    <h2>Main Facts</h2>
                    <div className={styles.field}>
                        <label>Location</label>
                        <input
                            value={settings.location || ''}
                            onChange={(e) => updateSetting('location', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Tour Types</label>
                        <input
                            value={settings.tourTypes || ''}
                            onChange={(e) => updateSetting('tourTypes', e.target.value)}
                        />
                    </div>
                </section>

                <section className={styles.section}>
                    <h2>Why Choose Us</h2>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                        <div key={num} className={styles.field}>
                            <label>Reason {num}</label>
                            <input
                                value={settings[`whyChooseUs${num}`] || ''}
                                onChange={(e) => updateSetting(`whyChooseUs${num}`, e.target.value)}
                            />
                        </div>
                    ))}
                </section>

                <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </form>
        </div>
    );
}

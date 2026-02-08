import GalleryClient from './GalleryClient';
import { getDictionary, normalizeLocale, Locale } from '@/lib/i18n';
import { getServerBaseUrl } from '@/lib/serverBaseUrl';
import styles from './page.module.css';

async function getGalleryImages(locale: Locale) {
    const baseUrl = getServerBaseUrl();
    const res = await fetch(`${baseUrl}/api/gallery?locale=${locale}&limit=36`, {
        next: { revalidate: 300 },
    });
    if (!res.ok) return { items: [] as any[], nextCursor: null };
    return res.json();
}

export default async function GalleryPage({ params }: { params: { locale: string } }) {
    const locale = normalizeLocale(params.locale) as Locale;
    const t = getDictionary(locale);
    const { items } = await getGalleryImages(locale);

    return (
        <div className={styles.page}>
            <section className={styles.header}>
                <div className="container">
                    <span className="eyebrow">{t.nav.gallery}</span>
                    <h1>{t.gallery.title}</h1>
                    <p>{t.gallery.subtitle}</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {items.length === 0 ? (
                        <div className={styles.empty}>
                            <h2>{t.gallery.emptyTitle}</h2>
                            <p>{t.gallery.emptyBody}</p>
                        </div>
                    ) : (
                        <GalleryClient images={items} />
                    )}
                </div>
            </section>
        </div>
    );
}

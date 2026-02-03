import TourCard from '@/components/TourCard';
import { getDictionary, normalizeLocale, Locale } from '@/lib/i18n';
import styles from './page.module.css';

async function getTours(locale: Locale) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
    const res = await fetch(`${baseUrl}/api/tours?locale=${locale}`, {
        next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return res.json();
}

export default async function ToursPage({ params }: { params: { locale: string } }) {
    const locale = normalizeLocale(params.locale) as Locale;
    const t = getDictionary(locale);
    const tours = await getTours(locale);

    return (
        <div className={styles.page}>
            <section className={styles.header}>
                <div className="container">
                    <span className="eyebrow">{t.nav.tours}</span>
                    <h1>{t.tours.title}</h1>
                    <p>{t.tours.subtitle}</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {tours.length === 0 ? (
                        <div className={styles.empty}>
                            <h2>{t.tours.emptyTitle}</h2>
                            <p>{t.tours.emptyBody}</p>
                        </div>
                    ) : (
                        <div className="grid-3">
                            {tours.map((tour: any) => (
                                <TourCard key={tour.id} tour={tour} locale={locale} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

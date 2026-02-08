import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary, normalizeLocale, Locale, getDifficultyLabel } from '@/lib/i18n';
import styles from './page.module.css';

async function getTour(id: string, locale: Locale) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
    const res = await fetch(`${baseUrl}/api/tours/${id}?locale=${locale}`, {
        next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function TourDetailPage({
    params,
}: {
    params: { id: string; locale: string };
}) {
    const locale = normalizeLocale(params.locale) as Locale;
    const t = getDictionary(locale);
    const tour = await getTour(params.id, locale);

    if (!tour) {
        notFound();
    }

    const priceValue = typeof tour.price === 'string' ? Number(tour.price) : tour.price;
    const formattedPrice = Number.isFinite(priceValue)
        ? new Intl.NumberFormat(locale, { style: 'currency', currency: 'GEL', maximumFractionDigits: 0 }).format(priceValue)
        : '—';

    return (
        <div className={styles.page}>
            <section className={styles.header}>
                <div className="container">
                    <span className="eyebrow">{t.nav.tours}</span>
                    <h1>{tour.name}</h1>
                    <div className={styles.meta}>
                        <span className={`badge badge-${tour.difficulty.toLowerCase()}`}>
                            {getDifficultyLabel(locale, tour.difficulty)}
                        </span>
                        <span className={styles.price}>{formattedPrice}</span>
                    </div>
                </div>
            </section>

            {tour.images.length > 0 && (
                <section className={styles.gallery}>
                    <div className="container">
                        <div className={styles.galleryGrid}>
                            {tour.images.map((image: any, index: number) => (
                                <div key={image.id || index} className={styles.galleryItem}>
                                    {typeof image.url === 'string' && image.url.startsWith('data:') ? (
                                        <img
                                            src={image.url}
                                            alt={`${tour.name} - Image ${index + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <Image
                                            src={image.url}
                                            alt={`${tour.name} - Image ${index + 1}`}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="section">
                <div className="container">
                    <div className={styles.content}>
                        <div className={styles.main}>
                            <h2>{t.tours.about}</h2>
                            <p className={styles.description}>{tour.description}</p>

                            {tour.times.length > 0 && (
                                <div className={styles.times}>
                                    <h3>{t.tours.availableTimes}</h3>
                                    <div className={styles.timeSlots}>
                                        {tour.times.map((time: any) => (
                                            <span key={time.id} className={styles.timeSlot}>
                                                {time.timeSlot}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.sidebar}>
                            <div className={styles.bookingCard}>
                                <h3>{t.tours.book}</h3>
                                <div className={styles.bookingPrice}>
                                    <span className={styles.priceLabel}>{t.tours.priceLabel}</span>
                                    <span className={styles.priceValue}>{formattedPrice}</span>
                                </div>
                                <a
                                    href="https://wa.me/99559434604"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                    style={{ width: '100%', textAlign: 'center' }}
                                >
                                    {t.tours.contactWhatsapp}
                                </a>
                                <a
                                    href="https://www.instagram.com/zazaguide_sakartvelo/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline"
                                    style={{ width: '100%', textAlign: 'center', marginTop: '1rem' }}
                                >
                                    {t.tours.messageInstagram}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.backSection}>
                <div className="container">
                    <Link href={`/${locale}/tours`} className="btn btn-secondary">
                        ← {t.tours.back}
                    </Link>
                </div>
            </section>
        </div>
    );
}

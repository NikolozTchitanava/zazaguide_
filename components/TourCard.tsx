import Link from 'next/link';
import Image from 'next/image';
import { getDictionary, getDifficultyLabel, Locale } from '@/lib/i18n';
import styles from './TourCard.module.css';

interface TourCardProps {
    locale: Locale;
    tour: {
        id: string;
        name: string;
        price: number | string;
        difficulty: string;
        images: { url: string; isPrimary: boolean }[];
    };
}

export default function TourCard({ tour, locale }: TourCardProps) {
    const primaryImage = tour.images.find((img) => img.isPrimary) || tour.images[0];
    const isInlineImage = Boolean(primaryImage?.url?.startsWith('data:'));
    const t = getDictionary(locale);
    const priceValue = typeof tour.price === 'string' ? Number(tour.price) : tour.price;
    const formattedPrice = Number.isFinite(priceValue)
        ? new Intl.NumberFormat(locale, { style: 'currency', currency: 'GEL', maximumFractionDigits: 0 }).format(priceValue)
        : '—';

    return (
        <Link href={`/${locale}/tours/${tour.id}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                {primaryImage ? (
                    isInlineImage ? (
                        <img
                            src={primaryImage.url}
                            alt={tour.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <Image
                            src={primaryImage.url}
                            alt={tour.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    )
                ) : (
                    <div className={styles.placeholder}>No Image</div>
                )}
                <span className={`${styles.badge} ${styles[tour.difficulty.toLowerCase()]}`}>
                    {getDifficultyLabel(locale, tour.difficulty)}
                </span>
            </div>
            <div className={styles.content}>
                <h3>{tour.name}</h3>
                <div className={styles.footer}>
                    <span className={styles.price}>{formattedPrice}</span>
                    <span className={styles.cta}>{t.common.viewDetails} →</span>
                </div>
            </div>
        </Link>
    );
}

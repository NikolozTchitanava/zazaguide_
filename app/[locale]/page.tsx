import Link from 'next/link';
import TourCard from '@/components/TourCard';
import { getDictionary, normalizeLocale, Locale } from '@/lib/i18n';
import { getServerBaseUrl } from '@/lib/serverBaseUrl';
import styles from './page.module.css';

async function getSettings(locale: Locale) {
  const baseUrl = getServerBaseUrl();
  const res = await fetch(`${baseUrl}/api/settings?locale=${locale}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return {};
  return res.json();
}

async function getFeaturedTours(locale: Locale) {
  const baseUrl = getServerBaseUrl();
  const res = await fetch(`${baseUrl}/api/tours?featured=true&locale=${locale}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = normalizeLocale(params.locale) as Locale;
  const t = getDictionary(locale);
  const settings = await getSettings(locale);
  const featuredTours = await getFeaturedTours(locale);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className="eyebrow">{settings.heroEyebrow || 'ZazaGuide'}</span>
          <h1 className={styles.heroTitle}>
            {settings.heroTagline || "Georgia, but deeper."}
          </h1>
          <p className={styles.heroSubtitle}>
            {settings.heroSubtitle || 'Mountains, monasteries, wine — led by local guides.'}
          </p>
          <div className={styles.heroActions}>
            <Link href={`/${locale}/tours`} className="btn btn-primary">
              {t.hero.cta}
            </Link>
            <Link href={`/${locale}/gallery`} className="btn btn-outline">
              {t.nav.gallery}
            </Link>
          </div>
        </div>
        <div className={styles.heroPanels}>
          <div className={styles.panel}>
            <h3>{settings.location || 'Tbilisi, Georgia'}</h3>
            <p>{settings.tourTypes || 'Hiking, city walks, wine tastings, cultural routes'}</p>
          </div>
          <div className={styles.panelAlt}>
            <h4>{t.sections.whyTitle}</h4>
            <ul>
              <li>{settings.whyChooseUs1 || 'Local guides with deep knowledge'}</li>
              <li>{settings.whyChooseUs2 || 'Small groups and a personal touch'}</li>
              <li>{settings.whyChooseUs3 || 'Flexible schedules and custom routes'}</li>
            </ul>
          </div>
        </div>
      </section>

      {featuredTours.length > 0 && (
        <section className={styles.featured}>
          <div className="container">
            <h2 className="section-title">{t.sections.featuredTitle}</h2>
            <p className="section-subtitle">{t.sections.featuredSubtitle}</p>
            <div className="grid-3">
              {featuredTours.map((tour: any) => (
                <TourCard key={tour.id} tour={tour} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={styles.story}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div>
              <span className="eyebrow">{t.home.storyEyebrow}</span>
              <h2 className={styles.storyTitle}>{t.home.storyTitle}</h2>
              <p className={styles.storyBody}>{t.home.storyBody}</p>
            </div>
            <div className={styles.storyCard}>
              <h3>{settings.whyChooseUs4 || 'Best value for authentic experiences'}</h3>
              <p>{settings.whyChooseUs5 || 'Safety-first approach and quality gear'}</p>
              <p>{settings.whyChooseUs6 || 'Responsible, sustainable tourism'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

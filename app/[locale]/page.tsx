import Image from 'next/image';
import Link from 'next/link';
import TourCard from '@/components/TourCard';
import { getDictionary, normalizeLocale, Locale } from '@/lib/i18n';
import { getServerBaseUrl } from '@/lib/serverBaseUrl';
import styles from './page.module.css';

type HomeSettings = Partial<Record<string, string>>;

async function getSettings(locale: Locale): Promise<HomeSettings> {
  const baseUrl = getServerBaseUrl();
  const res = await fetch(`${baseUrl}/api/settings?locale=${locale}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return {};
  return res.json();
}

async function getFeaturedTours(locale: Locale) {
  const baseUrl = getServerBaseUrl();
  const res = await fetch(`${baseUrl}/api/tours?featured=true&locale=${locale}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

type HomeCopy = {
  heroEyebrow: string;
  heroTagline: string;
  heroSubtitle: string;
  location: string;
  tourTypes: string;
  why1: string;
  why2: string;
  why3: string;
  why4: string;
  why5: string;
  why6: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutBody: string;
  aboutMember: string;
  aboutCertificateTitle: string;
  aboutCertificateBody: string;
};

const fallbackByLocale: Record<Locale, HomeCopy> = {
  en: {
    heroEyebrow: 'ZazaGuide',
    heroTagline: 'Georgia, but deeper.',
    heroSubtitle: 'Mountains, monasteries, wine - led by local guides.',
    location: 'Tbilisi, Georgia',
    tourTypes: 'Hiking, city walks, wine tastings, cultural routes',
    why1: 'Local guides with deep knowledge',
    why2: 'Small groups and a personal touch',
    why3: 'Flexible schedules and custom routes',
    why4: 'Best value for authentic experiences',
    why5: 'Safety-first approach and quality gear',
    why6: 'Responsible, sustainable tourism',
    aboutEyebrow: 'About Us',
    aboutTitle: 'Certified Guide, Trusted Experience',
    aboutBody:
      'Zaza is a certified guide in multiple fields, including wine tourism, walking tours, and destination guiding.',
    aboutMember: 'Zaza is a member of the World Guides Association.',
    aboutCertificateTitle: 'Professional Certificate',
    aboutCertificateBody: 'Tourism management and tourist guiding certification by Newkaz.',
  },
  ka: {
    heroEyebrow: 'ZazaGuide',
    heroTagline: 'აღმოაჩინე საქართველო უფრო ღრმად',
    heroSubtitle: 'მთები, მონასტრები და ღვინო - ადგილობრივ გიდებთან ერთად.',
    location: 'თბილისი, საქართველო',
    tourTypes: 'ლაშქრობა, ქალაქის ტურები, ღვინის დეგუსტაცია, კულტურული მარშრუტები',
    why1: 'ადგილობრივი გიდები ღრმა ცოდნით',
    why2: 'პატარა ჯგუფები და პერსონალური მიდგომა',
    why3: 'მოქნილი გრაფიკი და ინდივიდუალური მარშრუტები',
    why4: 'საუკეთესო ფასები ავთენტური გამოცდილებისთვის',
    why5: 'უსაფრთხოება პირველ ადგილზე',
    why6: 'პასუხისმგებლიანი და მდგრადი ტურიზმი',
    aboutEyebrow: 'ჩვენ შესახებ',
    aboutTitle: 'სერტიფიცირებული გიდი და სანდო გამოცდილება',
    aboutBody:
      'ზაზა არის სერტიფიცირებული გიდი მრავალ მიმართულებაში: ღვინის ტურიზმი, ფეხით ტურები და ტურისტული გიდობა.',
    aboutMember: 'ზაზა მსოფლიო გიდების ასოციაციის წევრია.',
    aboutCertificateTitle: 'პროფესიული სერტიფიკატი',
    aboutCertificateBody: 'Newkaz-ის ტურიზმის მენეჯმენტისა და ტურისტული გიდობის სერტიფიკატი.',
  },
  ru: {
    heroEyebrow: 'ZazaGuide',
    heroTagline: 'Грузия, но глубже.',
    heroSubtitle: 'Горы, монастыри и вино - с местными гидами.',
    location: 'Тбилиси, Грузия',
    tourTypes: 'Походы, городские прогулки, винные дегустации, культурные маршруты',
    why1: 'Местные гиды с глубокими знаниями',
    why2: 'Небольшие группы и личный подход',
    why3: 'Гибкий график и индивидуальные маршруты',
    why4: 'Лучшее соотношение цены и качества',
    why5: 'Безопасность и качественная организация',
    why6: 'Ответственный и устойчивый туризм',
    aboutEyebrow: 'О нас',
    aboutTitle: 'Сертифицированный гид и проверенный опыт',
    aboutBody:
      'Заза - сертифицированный гид в нескольких направлениях: винный туризм, пешеходные экскурсии и сопровождение туристов.',
    aboutMember: 'Заза является членом Всемирной ассоциации гидов.',
    aboutCertificateTitle: 'Профессиональный сертификат',
    aboutCertificateBody: 'Сертификат Newkaz по туристическому менеджменту и сопровождению туристов.',
  },
};

const englishDefaults = {
  heroEyebrow: 'ZazaGuide',
  heroTagline: 'Georgia, but deeper.',
  heroSubtitle: 'Mountains, monasteries, wine - led by local guides.',
};

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = normalizeLocale(params.locale) as Locale;
  const t = getDictionary(locale);
  const settings = await getSettings(locale);
  const featuredTours = await getFeaturedTours(locale);
  const copy = fallbackByLocale[locale];

  const pickLocalized = (value: string | undefined, fallback: string, englishDefault?: string) => {
    if (!value || !value.trim()) return fallback;
    const clean = value.trim();
    if (locale !== 'en' && englishDefault && clean === englishDefault) return fallback;
    return clean;
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className="eyebrow">
            {pickLocalized(settings.heroEyebrow, copy.heroEyebrow, englishDefaults.heroEyebrow)}
          </span>
          <h1 className={styles.heroTitle}>
            {pickLocalized(settings.heroTagline, copy.heroTagline, englishDefaults.heroTagline)}
          </h1>
          <p className={styles.heroSubtitle}>
            {pickLocalized(settings.heroSubtitle, copy.heroSubtitle, englishDefaults.heroSubtitle)}
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
            <h3>{settings.location || copy.location}</h3>
            <p>{settings.tourTypes || copy.tourTypes}</p>
          </div>
          <div className={styles.panelAlt}>
            <h4>{t.sections.whyTitle}</h4>
            <ul>
              <li>{settings.whyChooseUs1 || copy.why1}</li>
              <li>{settings.whyChooseUs2 || copy.why2}</li>
              <li>{settings.whyChooseUs3 || copy.why3}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.aboutSection}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <article className={styles.aboutCard}>
              <span className="eyebrow">{copy.aboutEyebrow}</span>
              <h2>{copy.aboutTitle}</h2>
              <p>{copy.aboutBody}</p>
              <p className={styles.aboutMember}>{copy.aboutMember}</p>
            </article>

            <article className={styles.certificateCard}>
              <div className={styles.certificateMedia}>
                <Image
                  src="/uploads/newkaz-certificate.svg"
                  alt="Newkaz guide certificate for Zaza Chitanava"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
              <h3>{copy.aboutCertificateTitle}</h3>
              <p>{copy.aboutCertificateBody}</p>
            </article>
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
              <h3>{settings.whyChooseUs4 || copy.why4}</h3>
              <p>{settings.whyChooseUs5 || copy.why5}</p>
              <p>{settings.whyChooseUs6 || copy.why6}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

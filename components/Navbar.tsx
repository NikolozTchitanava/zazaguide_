'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { getDictionary, localeNames, locales, Locale } from '@/lib/i18n';
import styles from './Navbar.module.css';

export default function Navbar({ locale }: { locale: Locale }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const t = getDictionary(locale);

    const basePath = pathname.replace(/^\/(en|ka|ru)(?=\/|$)/, '');
    const buildLocalePath = (targetLocale: string) => {
        const nextPath = basePath === '' ? '' : basePath;
        return `/${targetLocale}${nextPath}`;
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href={`/${locale}`} className={styles.logo}>
                    <span>ZazaGuide</span>
                    <span className={styles.logoTag}>{t.nav.logoTag}</span>
                </Link>

                <button
                    className={styles.hamburger}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <ul className={`${styles.navLinks} ${isOpen ? styles.active : ''}`}>
                    <li>
                        <Link href={`/${locale}`} onClick={() => setIsOpen(false)}>
                            {t.nav.home}
                        </Link>
                    </li>
                    <li>
                        <Link href={`/${locale}/tours`} onClick={() => setIsOpen(false)}>
                            {t.nav.tours}
                        </Link>
                    </li>
                    <li>
                        <Link href={`/${locale}/gallery`} onClick={() => setIsOpen(false)}>
                            {t.nav.gallery}
                        </Link>
                    </li>
                    <li className={styles.localeSwitch}>
                        {locales.map((loc) => (
                            <Link
                                key={loc}
                                href={buildLocalePath(loc)}
                                className={loc === locale ? styles.localeActive : styles.localeLink}
                                onClick={() => setIsOpen(false)}
                            >
                                {localeNames[loc]}
                            </Link>
                        ))}
                    </li>
                </ul>
            </div>
        </nav>
    );
}

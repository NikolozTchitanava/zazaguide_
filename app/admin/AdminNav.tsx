'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import styles from './AdminNav.module.css';

export default function AdminNav() {
    const pathname = usePathname();

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    ZazaGuide Admin
                </Link>

                <ul className={styles.links}>
                    <li>
                        <Link
                            href="/admin"
                            className={pathname === '/admin' ? styles.active : ''}
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/admin/tours"
                            className={pathname === '/admin/tours' ? styles.active : ''}
                        >
                            Tours
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/admin/homepage"
                            className={pathname === '/admin/homepage' ? styles.active : ''}
                        >
                            Homepage
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/admin/gallery"
                            className={pathname === '/admin/gallery' ? styles.active : ''}
                        >
                            Gallery
                        </Link>
                    </li>
                    <li>
                        <button onClick={() => signOut({ callbackUrl: '/' })} className={styles.logout}>
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

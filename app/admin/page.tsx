import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import styles from './page.module.css';

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    return (
        <div className={styles.page}>
            <h1>Admin Dashboard</h1>
            <p className={styles.welcome}>Welcome back, {session?.user?.name}!</p>

            <div className={styles.grid}>
                <Link href="/admin/tours" className={styles.card}>
                    <div className={styles.icon}>Tours</div>
                    <h2>Manage Tours</h2>
                    <p>Create, edit, and delete tours</p>
                </Link>

                <Link href="/admin/homepage" className={styles.card}>
                    <div className={styles.icon}>Homepage</div>
                    <h2>Homepage Settings</h2>
                    <p>Edit homepage content and facts</p>
                </Link>

                <Link href="/admin/gallery" className={styles.card}>
                    <div className={styles.icon}>Gallery</div>
                    <h2>Gallery</h2>
                    <p>Upload and manage gallery images</p>
                </Link>

                <a href="/" className={styles.card} target="_blank" rel="noopener noreferrer">
                    <div className={styles.icon}>Website</div>
                    <h2>View Website</h2>
                    <p>See the public website</p>
                </a>
            </div>
        </div>
    );
}

import AdminNav from './AdminNav';
import styles from './layout.module.css';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.layout}>
            <AdminNav />
            <main className={styles.main}>{children}</main>
        </div>
    );
}

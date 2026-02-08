export function getServerBaseUrl() {
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    if (process.env.NEXT_PUBLIC_BASE_URL) {
        return process.env.NEXT_PUBLIC_BASE_URL;
    }

    if (process.env.NEXTAUTH_URL) {
        return process.env.NEXTAUTH_URL;
    }

    return 'http://localhost:5000';
}

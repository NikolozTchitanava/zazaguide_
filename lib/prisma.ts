import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function withSupabasePoolerParams(url: string | undefined) {
    if (!url || !url.includes('pooler.supabase.com')) {
        return url;
    }

    try {
        const parsed = new URL(url);
        if (!parsed.searchParams.has('pgbouncer')) {
            parsed.searchParams.set('pgbouncer', 'true');
        }
        if (!parsed.searchParams.has('connection_limit')) {
            parsed.searchParams.set('connection_limit', '1');
        }
        return parsed.toString();
    } catch {
        return url;
    }
}

const runtimeDatabaseUrl = withSupabasePoolerParams(process.env.DATABASE_URL);

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        datasourceUrl: runtimeDatabaseUrl,
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { normalizeLocale } from '@/lib/i18n';

// GET homepage settings
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const locale = normalizeLocale(searchParams.get('locale') || undefined);

        const settings = await prisma.homepageSetting.findMany({
            where: { locale },
        });

        const settingsObj = settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {} as Record<string, string>);

        return NextResponse.json(settingsObj);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

// PUT update homepage settings (admin only)
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const locale = normalizeLocale(searchParams.get('locale') || undefined);
        const body = await request.json();

        for (const [key, value] of Object.entries(body)) {
            await prisma.homepageSetting.upsert({
                where: { key_locale: { key, locale } },
                update: { value: value as string },
                create: { key, value: value as string, locale },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { normalizeLocale } from '@/lib/i18n';

// GET gallery images
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const locale = normalizeLocale(searchParams.get('locale') || undefined);
        const limitParam = Number(searchParams.get('limit') || 24);
        const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 60) : 24;
        const cursor = searchParams.get('cursor');

        const images = await prisma.galleryImage.findMany({
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                url: true,
                createdAt: true,
                translations: {
                    where: { locale: { in: [locale, 'en'] } },
                    select: { locale: true, caption: true },
                },
            },
        });

        const result = images.map((image) => {
            const translation =
                image.translations.find((t) => t.locale === locale) ||
                image.translations.find((t) => t.locale === 'en');

            return {
                id: image.id,
                url: image.url,
                createdAt: image.createdAt,
                caption: translation?.caption || null,
            };
        });

        const nextCursor = result.length === limit ? result[result.length - 1].id : null;

        return NextResponse.json({ items: result, nextCursor });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch gallery images' },
            { status: 500 }
        );
    }
}

// POST create new gallery image (admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { url, translations } = body;
        const translationRows = Array.isArray(translations) ? translations : [];

        if (!url) {
            return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
        }

        const image = await prisma.galleryImage.create({
            data: {
                url,
                translations: {
                    create: translationRows.map((translation: any) => ({
                        locale: translation.locale,
                        caption: translation.caption || null,
                    })),
                },
            },
            include: { translations: true },
        });

        return NextResponse.json(image);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create gallery image' },
            { status: 500 }
        );
    }
}

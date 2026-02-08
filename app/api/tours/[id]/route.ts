import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { normalizeLocale } from '@/lib/i18n';
import { Prisma } from '@prisma/client';

// GET single tour by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const locale = normalizeLocale(searchParams.get('locale') || undefined);

        const tour = await prisma.tour.findUnique({
            where: { id: params.id },
            select: {
                id: true,
                price: true,
                difficulty: true,
                featured: true,
                images: {
                    orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
                    select: {
                        id: true,
                        url: true,
                        isPrimary: true,
                    },
                },
                times: {
                    select: { id: true, timeSlot: true },
                },
                translations: {
                    where: { locale: { in: [locale, 'en'] } },
                    select: { locale: true, name: true, description: true },
                },
            },
        });

        if (!tour) {
            return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
        }

        const translation =
            tour.translations.find((t) => t.locale === locale) ||
            tour.translations.find((t) => t.locale === 'en');

        return NextResponse.json({
            ...tour,
            name: translation?.name || 'Untitled tour',
            description: translation?.description || '',
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch tour' },
            { status: 500 }
        );
    }
}

// PUT update tour (admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { price, difficulty, featured, images, times, translations } = body;
        if (price === undefined || price === null || Number.isNaN(Number(price))) {
            return NextResponse.json({ error: 'Valid price is required' }, { status: 400 });
        }
        const priceValue = new Prisma.Decimal(price);
        const translationRows = Array.isArray(translations) ? translations : [];

        if (translationRows.length === 0) {
            return NextResponse.json({ error: 'Translations are required' }, { status: 400 });
        }

        const english = translationRows.find((translation: any) => translation.locale === 'en');
        if (!english?.name || !english?.description) {
            return NextResponse.json({ error: 'English name and description are required' }, { status: 400 });
        }

        const updated = await prisma.$transaction(async (tx) => {
            await tx.tourImage.deleteMany({ where: { tourId: params.id } });
            await tx.tourTime.deleteMany({ where: { tourId: params.id } });

            const tour = await tx.tour.update({
                where: { id: params.id },
                data: {
                    price: priceValue,
                    difficulty,
                    featured: featured || false,
                    images: {
                        create: images?.map((img: any, index: number) => ({
                            url: img.url,
                            isPrimary: index === 0,
                            sortOrder: index,
                        })) || [],
                    },
                    times: {
                        create: times?.map((time: string) => ({
                            timeSlot: time,
                        })) || [],
                    },
                    translations: {
                        upsert: translationRows.map((translation: any) => ({
                            where: {
                                tourId_locale: {
                                    tourId: params.id,
                                    locale: translation.locale,
                                },
                            },
                            update: {
                                name: translation.name,
                                description: translation.description,
                            },
                            create: {
                                locale: translation.locale,
                                name: translation.name,
                                description: translation.description,
                            },
                        })),
                    },
                },
                include: {
                    images: { select: { id: true, url: true, isPrimary: true, sortOrder: true } },
                    times: { select: { id: true, timeSlot: true } },
                    translations: { select: { locale: true, name: true, description: true } },
                },
            });

            return tour;
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating tour:', error);
        return NextResponse.json(
            { error: 'Failed to update tour' },
            { status: 500 }
        );
    }
}

// DELETE tour (admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const tour = await prisma.tour.findUnique({
            where: { id: params.id },
            select: { images: { select: { url: true } } },
        });

        await prisma.tour.delete({
            where: { id: params.id },
        });

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'tours';

        if (supabaseUrl && supabaseKey && tour?.images?.length) {
            const publicPrefix = `${supabaseUrl}/storage/v1/object/public/${bucket}/`;
            await Promise.all(
                tour.images.map(async (image) => {
                    if (image.url.startsWith(publicPrefix)) {
                        const objectPath = image.url.slice(publicPrefix.length);
                        await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${objectPath}`, {
                            method: 'DELETE',
                            headers: {
                                Authorization: `Bearer ${supabaseKey}`,
                                apikey: supabaseKey,
                            },
                        });
                    }
                })
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete tour' },
            { status: 500 }
        );
    }
}

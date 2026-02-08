import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { normalizeLocale } from '@/lib/i18n';
import { Prisma } from '@prisma/client';

type TourTranslationRow = { locale: string; name: string; description: string };
type TourListRow = {
    id: string;
    price: Prisma.Decimal;
    difficulty: string;
    featured: boolean;
    images: Array<{ id: string; url: string; isPrimary: boolean }>;
    times: Array<{ id: string; timeSlot: string }>;
    translations: TourTranslationRow[];
};

// GET all tours or featured tours
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured');
        const includeTranslations = searchParams.get('includeTranslations') === 'true';
        const locale = normalizeLocale(searchParams.get('locale') || undefined);

        if (includeTranslations) {
            const session = await getServerSession(authOptions);
            if (!session) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const tours = (await prisma.tour.findMany({
            where: featured === 'true' ? { featured: true } : undefined,
            orderBy: { createdAt: 'desc' },
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
                translations: includeTranslations
                    ? { select: { locale: true, name: true, description: true } }
                    : {
                          where: { locale: { in: [locale, 'en'] } },
                          select: { locale: true, name: true, description: true },
                },
            },
        })) as TourListRow[];

        const result = includeTranslations
            ? tours
            : tours.map((tour) => {
                  let translation: TourTranslationRow | undefined;
                  for (const candidate of tour.translations) {
                      if (candidate.locale === locale) {
                          translation = candidate;
                          break;
                      }
                  }
                  if (!translation) {
                      for (const candidate of tour.translations) {
                          if (candidate.locale === 'en') {
                              translation = candidate;
                              break;
                          }
                      }
                  }

                  return {
                      ...tour,
                      name: translation?.name || 'Untitled tour',
                      description: translation?.description || '',
                  };
              });

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch tours' },
            { status: 500 }
        );
    }
}

// POST create new tour (admin only)
export async function POST(request: NextRequest) {
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

        const tour = await prisma.tour.create({
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
                    create: translationRows.map((translation: any) => ({
                        locale: translation.locale,
                        name: translation.name,
                        description: translation.description,
                    })),
                },
            },
            include: {
                images: { select: { id: true, url: true, isPrimary: true, sortOrder: true } },
                times: { select: { id: true, timeSlot: true } },
                translations: { select: { locale: true, name: true, description: true } },
            },
        });

        return NextResponse.json(tour);
    } catch (error) {
        console.error('Error creating tour:', error);
        return NextResponse.json(
            { error: 'Failed to create tour' },
            { status: 500 }
        );
    }
}

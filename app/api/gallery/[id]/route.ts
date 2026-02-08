import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE gallery image (admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const image = await prisma.galleryImage.findUnique({
            where: { id: params.id },
            select: { url: true },
        });

        await prisma.galleryImage.delete({
            where: { id: params.id },
        });

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'tours';

        if (image?.url && supabaseUrl && supabaseKey) {
            const publicPrefix = `${supabaseUrl}/storage/v1/object/public/${bucket}/`;
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
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete gallery image' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import crypto from 'crypto';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'tours';

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Only image uploads are allowed' }, { status: 400 });
        }

        if (file.size > MAX_UPLOAD_BYTES) {
            return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const safeExtension = extension.replace(/[^a-z0-9]/g, '') || 'jpg';
        const filename = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${safeExtension}`;

        const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${filename}`;
        const uploadRes = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${supabaseKey}`,
                'Content-Type': file.type,
                'x-upsert': 'true',
            },
            body: buffer,
        });

        if (!uploadRes.ok) {
            const errorText = await uploadRes.text();
            console.error('Upload failed:', errorText);
            return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
        }

        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${filename}`;
        return NextResponse.json({ url: publicUrl });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}

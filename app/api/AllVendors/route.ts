import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userEmail = searchParams.get('userEmail');

        if (!userEmail) {
            return NextResponse.json({ error: 'Missing user email' }, { status: 400 });
        }

        const vendors = await prisma.vendor.findMany({
            where: {
                userEmail: userEmail,
            },
        });

        return NextResponse.json(vendors, { status: 200 });
    } catch (error) {
        console.error('Error fetching vendors:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

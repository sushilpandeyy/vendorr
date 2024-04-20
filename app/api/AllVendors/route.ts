import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const VENDORS_PER_PAGE = 10;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);

        if (isNaN(page) || page <= 0) {
            return NextResponse.json({ error: 'Invalid page number' }, { status: 400 });
        }

        const skip = (page - 1) * VENDORS_PER_PAGE;

        const vendors = await prisma.vendor.findMany({
            skip: skip,
            take: VENDORS_PER_PAGE,
        });

        const totalVendorsCount = await prisma.vendor.count();

        const totalPages = Math.ceil(totalVendorsCount / VENDORS_PER_PAGE);

        return NextResponse.json({
            vendors,
            totalPages,
            totalCount: totalVendorsCount,
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching vendors:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

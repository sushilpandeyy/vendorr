import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
      if (!id) {
          return NextResponse.json({ error: 'Missing vendor ID' }, { status: 400 });
      }
      const vendor = await prisma.vendor.findUnique({
          where: {
              id: id,
          },
      });
      if (!vendor) {
          return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
      }
      return NextResponse.json(vendor, { status: 200 });
  } catch (error) {
      console.error('Error fetching vendor:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();

    const { name, bankAccountNumber, bankName, addressLine1, addressLine2, city, country, zipCode, userEmail } = req;
    if (!name || !bankAccountNumber || !bankName || !addressLine1 || !userEmail) {
      console.log(req);
      console.log(userEmail);
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const newVendor = await prisma.vendor.create({
      data: {
        name,
        bankAccountNumber,
        bankName,
        addressLine1,
        addressLine2: addressLine2 || null,
        city: city || null,
        country: country || null,
        zipCode: zipCode || null,
        userEmail, 
      },
    });
    return NextResponse.json({ message: 'Vendor added successfully', vendor: newVendor }, { status: 201 });

  } catch (error) {
    console.error('Error adding vendor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const req = await request.json();
        const { id, ...vendorData } = req;
        if (!id) {
      return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
    }
        const updatedVendor = await prisma.vendor.update({
      where: {
        id: id,
      },
      data: vendorData,
    });
    return NextResponse.json({ message: 'Vendor updated successfully', vendor: updatedVendor }, { status: 200 });
  } catch (error) {
    console.error('Error updating vendor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); 
    
      console.log(id)
      if (!id) {
          return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
      }
      const deletedVendor = await prisma.vendor.delete({
          where: {
              id: id,
          },
      });

      return NextResponse.json({ message: 'Vendor deleted successfully', vendor: deletedVendor }, { status: 200 });
  } catch (error) {
      console.error('Error deleting vendor:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

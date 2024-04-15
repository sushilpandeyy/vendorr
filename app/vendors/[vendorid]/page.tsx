'use client'

import React from 'react';
import VendorForm from './Vendorform';

interface PageProps {
    vendorId: string;
}

const Page: React.FC<PageProps> = ({ vendorId }) => {
    return <VendorForm id={vendorId} />;
};

export default Page;
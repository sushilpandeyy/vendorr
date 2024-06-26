'use client'

import { usePathname } from 'next/navigation';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import './formStyles.css';
import '../styles.css';
import LoadingComponent from '../../components/Loading';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FormData {
    id?: string;
    name: string;
    bankAccountNumber: string;
    bankName: string;
    addressLine1: string;
    addressLine2?: string;
    city?: string;
    country?: string;
    zipCode?: string;
    userEmail?: string;
}


export default function VendorForm(){
    const pathname = usePathname();
    const router = useRouter();
    function getIdFromPath(path: string): string {
        const startIndex: number = 9;
        if (startIndex !== -1) {
            return path.substring(startIndex, path.length);
        }
        return '';
    }
    
    const id = getIdFromPath(pathname);
    
    const { data: session } = useSession();

    const [formData, setFormData] = useState<FormData>({
        name: '',
        bankAccountNumber: '',
        bankName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        country: '',
        zipCode: '',
        userEmail: session?.user?.email || '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            axios.get(`/api/AddVendor?id=${id}`)
                .then(response => {
                    setFormData(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching vendor data:', error);
                    setError('Failed to fetch vendor data. Please try again.');
                    setLoading(false);
                });
        }
    }, [id]);

    if (!session) {
        return null;
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.put(`/api/AddVendor?id=${id}`, formData);
            console.log('Vendor updated successfully:', response.data);
            setError('UPDATED');
            window.location.reload();
            router.push("/vendors");
        } catch (error) {
            console.error('Error updating vendor:', error);
            setError('Failed to update vendor. Please try again.');
        }
    };

    return (
        <div className="form-container">
            {loading ? (
                <LoadingComponent />
            ) : (
                <>
                    <h2>Update Vendor</h2>
                    {error && <p className="error">{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Vendor Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="bankAccountNumber">Bank Account Number</label>
                            <input
                                type="text"
                                id="bankAccountNumber"
                                name="bankAccountNumber"
                                value={formData.bankAccountNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="bankName">Bank Name</label>
                            <input
                                type="text"
                                id="bankName"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="addressLine1">Address Line 1</label>
                            <input
                                type="text"
                                id="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Additional form fields */}
                        <div className="form-group">
                            <label htmlFor="addressLine2">Address Line 2 (Optional)</label>
                            <input
                                type="text"
                                id="addressLine2"
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city">City (Optional)</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="country">Country (Optional)</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="zipCode">Zip Code (Optional)</label>
                            <input
                                type="text"
                                id="zipCode"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="submit-btn">
                            Update Vendor
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

'use client';

import React, { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import './styles.css';
import AddVendorForm from '../components/form';
import axios from 'axios';
import Link from 'next/link';
import LoadingComponent from '../components/Loading';

interface Vendor {
    id: string;
    Addedby: string;
    name: string;
    bankAccountNumber: string;
    bankName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    country: string;
    zipCode: string;
    userEmail: string;
}

const Admin: React.FC = () => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showAddVendorForm, setShowAddVendorForm] = useState<boolean>(false);
    const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
    const [vendorIdToDelete, setVendorIdToDelete] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { data: session } = useSession();
    const email = session?.user?.email || '';
    const router = useRouter();
    useEffect(() => {
        if (session) {
            fetchVendors(currentPage);
        }
    }, [currentPage, email, session]);
    if (!session) {
        router.push('/');
        return null;
    }
     const fetchVendors = async (page: number) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/AllVendors', {
                params: {
                    page,
                },
            });
            const data = response.data;
            setVendors(data.vendors);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddVendor = () => {
        setShowAddVendorForm(true);
    };

    const handleAddVendorSubmit = async (formData: any) => {
        const response = await fetch('/api/vendors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            fetchVendors(currentPage);
            setShowAddVendorForm(false);
        } else {
        }
    };

    const handleDeleteVendor = async (id: string): Promise<void> => {
        try {
            await axios.delete(`/api/AddVendor?id=${id}`);
            fetchVendors(currentPage);
            setShowDeletePopup(false);
        } catch (error) {
            console.error('Error deleting vendor:', error);
        }
    };

    const confirmDelete = (vendorId: string): void => {
        setVendorIdToDelete(vendorId);
        setShowDeletePopup(true);
    };

    const cancelDelete = (): void => {
        setVendorIdToDelete(null);
        setShowDeletePopup(false);
    };

    return (
        <div className="admin-container">
            <nav className="navbar">
                <div className="navbar-left">
                    <h1 className="navbar-title">Vendor Management</h1>
                </div>
                <div className="navbar-right">
                    <button className="sign-out-button" onClick={() => signOut()}>
                        Sign Out
                    </button>
                </div>
            </nav>

            <div className="add-vendor-button-container">
                <button className="add-vendor-button" onClick={handleAddVendor}>
                    Add Vendor
                </button>
            </div>

            {showAddVendorForm && (
                <AddVendorForm
                    onClose={() => setShowAddVendorForm(false)}
                    onSubmit={handleAddVendorSubmit}
                    Emailid={email}
                />
            )}

            <div className="vendor-card-container">
                {loading ? (
                    <LoadingComponent />
                ) : vendors.length === 0 ? (
                    <p className="no-vendors-message">Zero Vendor's in this account</p>
                ) : (
                    vendors.map((vendor) => ((email==vendor.userEmail)?
                        <div key={vendor.id} className="vendor-card">
    <h3 className="vendor-card-title">{vendor.name}</h3>
    <p><strong>Bank Account No.:</strong> {vendor.bankAccountNumber}</p>
    <p><strong>Bank Name:</strong> {vendor.bankName}</p>
    <p><strong>Address:</strong> {`${vendor.addressLine1}, ${vendor.addressLine2 || ''}, ${vendor.city}, ${vendor.country}, ${vendor.zipCode}`}</p>
    <p><strong>Added By:</strong> {vendor.Addedby} [You]</p>
    <div className="action-buttons">
        <Link href={`/vendors/${vendor.id}`}>
            <button className="edit-button">Edit</button>
        </Link>
        <button className="delete-button" onClick={() => confirmDelete(vendor.id)}>
            Delete
        </button>
    </div>
</div>:<div key={vendor.id} className="vendor-card">
    <h3 className="vendor-card-title">{vendor.name}</h3>
    <p><strong>Bank Account No.:</strong> {vendor.bankAccountNumber}</p>
    <p><strong>Bank Name:</strong> {vendor.bankName}</p>
    <p><strong>Address:</strong> {`${vendor.addressLine1}, ${vendor.addressLine2 || ''}, ${vendor.city}, ${vendor.country}, ${vendor.zipCode}`}</p>
    <p><strong>Added By:</strong> {vendor.Addedby}</p>
</div>


                    ))
                )}
            </div>

            {showDeletePopup && vendorIdToDelete && (
                <div className="popup-overlay">
                    <div className="popup-form">
                        <h3>Are you sure you want to delete this vendor?</h3>
                        <div className="action-buttons">
                            <button className="confirm-button" onClick={() => handleDeleteVendor(vendorIdToDelete)}>
                                Yes, Delete
                            </button>
                            <button className="cancel-button" onClick={cancelDelete}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="pagination">
                <button
                    className="pagination-button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    className="pagination-button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Admin;

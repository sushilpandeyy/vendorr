"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import "./styles.css"

interface Vendor {
  id: string;
  name: string;
  bankAccountNumber: string;
  bankName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country: string;
  zipCode: string;
}

const Admin: React.FC = () => {
  const { data: session } = useSession();
  console.log(session?.user?.email);
  const router = useRouter();

  if (!session) {
    router.push("/");
    return null;
  }

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Fetch vendors for the current page
    fetchVendors(currentPage);
  }, [currentPage]);

  const fetchVendors = async (page: number) => {
    // Replace this URL with your API endpoint to fetch vendors.
    const response = await fetch(`/api/vendors?page=${page}`);
    const data = await response.json();
    setVendors(data.vendors);
    setTotalPages(data.totalPages);
  };

  const handleAddVendor = () => {
    // Handle adding a new vendor (e.g., show a form).
  };

  const handleEditVendor = (id: string) => {
    // Handle editing a vendor (e.g., navigate to edit form).
  };

  const handleDeleteVendor = async (id: string) => {
    // Handle deleting a vendor.
    await fetch(`/api/vendors/${id}`, { method: "DELETE" });
    fetchVendors(currentPage);
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

  <div className="vendor-card-container">
    {vendors.map((vendor) => (
      <div key={vendor.id} className="vendor-card">
        <h3 className="vendor-card-title">{vendor.name}</h3>
        <p><strong>Bank Account No.:</strong> {vendor.bankAccountNumber}</p>
        <p><strong>Bank Name:</strong> {vendor.bankName}</p>
        <p><strong>Address:</strong> {vendor.addressLine1}, {vendor.addressLine2}, {vendor.city}, {vendor.country}, {vendor.zipCode}</p>
        <div className="action-buttons">
          <button
            className="edit-button"
            onClick={() => handleEditVendor(vendor.id)}
          >
            Edit
          </button>
          <button
            className="delete-button"
            onClick={() => handleDeleteVendor(vendor.id)}
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>

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

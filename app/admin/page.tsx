"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import "./styles.css"

// Define the Vendor type
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
  const router = useRouter();

  if (!session) {
    // Redirect to the login page if the user is not logged in
    router.push("/login");
    return null; // Don't render anything if redirecting
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
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">Vendor Management</div>
        <button className="sign-out-button" onClick={() => signOut()}>
          Sign Out
        </button>
      </nav>

      {/* Add Vendor Button */}
      <div className="add-vendor-button-container">
        <button
          className="add-vendor-button"
          onClick={handleAddVendor}
        >
          Add Vendor
        </button>
      </div>

      {/* Vendor Table */}
      <div className="vendor-table-container">
        <table className="vendor-table">
          <thead>
            <tr>
              <th>Vendor Name</th>
              <th>Bank Account No.</th>
              <th>Bank Name</th>
              <th>Address Line 1</th>
              <th>Address Line 2</th>
              <th>City</th>
              <th>Country</th>
              <th>Zip Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td>{vendor.name}</td>
                <td>{vendor.bankAccountNumber}</td>
                <td>{vendor.bankName}</td>
                <td>{vendor.addressLine1}</td>
                <td>{vendor.addressLine2}</td>
                <td>{vendor.city}</td>
                <td>{vendor.country}</td>
                <td>{vendor.zipCode}</td>
                <td className="action-buttons">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

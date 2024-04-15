'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react';
import './formStyles.css';
import axios from "axios";

interface FormData {
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

interface AddVendorFormProps {
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  Emailid: string;
}

const AddVendorForm: React.FC<AddVendorFormProps> = ({ onClose, onSubmit, Emailid }) => {
    const [formData, setFormData] = useState<FormData>({
      name: '',
      bankAccountNumber: '',
      bankName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      country: '',
      zipCode: '',
      userEmail: Emailid,
    });
    
    const [error, setError] = useState<string | null>(null); // State for error messages
  
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e: FormEvent): Promise<void> => {
      e.preventDefault();
      setError(null); // Clear any previous error messages
      
      try {
        const response = await axios.post('/api/AddVendor', formData);
        console.log('Vendor added successfully:', response.data);
        
        if (onSubmit) {
          onSubmit(formData);
        }
        
        // Reload the page upon successful submission
        window.location.reload();
      } catch (error) {
        // Handle error by setting an error message
        console.error('Error adding vendor:', error);
        setError('Failed to add vendor. Please try again.');
      }
    };
  
    return (
      <div className="popup-overlay">
        <div className="popup-form">
          <div className="form-header">
            <h2>Add Vendor</h2>
            <button className="close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            {/* Display error message if there is one */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {/* Form fields */}
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
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                required
              />
            </div>
            
            {/* Additional fields */}
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
              Add Vendor
            </button>
          </form>
        </div>
      </div>
    );
  };
  export default AddVendorForm;
  